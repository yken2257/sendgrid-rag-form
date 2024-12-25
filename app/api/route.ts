import type { NextRequest } from "next/server";
import { LangChainAdapter } from "ai";

import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	RunnableSequence,
	RunnablePassthrough,
} from "@langchain/core/runnables";
import type { Document } from "@langchain/core/documents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";

export const runtime = "edge";
export const maxDuration = 30;

const TEMPLATE = `あなたはSendGridユーザの質問に答えるAIアシスタントです。
質問者はあなたの回答で解決できなければ、SendGridのサポートに問い合わせることになります。
以下の「# 回答ルール」に従って、末尾の「# 質問」に答えてください。

# 回答ルール
- 以下の「# 参考ドキュメント」だけに基づいて回答してください。参考ドキュメントから読み取れないことは回答しないでください。
- 参考ドキュメントは「# 参考ドキュメントのJSON形式」のフォーマットで記載されています。
- 参考にしたドキュメントにsource_urlが記載されている場合、回答の最後に「以下のページもご覧ください。」に続けてURLを必ず記載してください。「source_url」という文字は含めないでください。
- 直接の回答にならなくても、参考になる情報があればそれを回答してください。その場合も必ず、回答の参考にした情報のURLをを「以下のページもご覧ください。」に続けて記載してください。
- ハルシネーションしないでください。page_contentやsource_urlに記載されていないURLを回答しないでください。
- URLを出力する際は、[https://www.example.com](https://www.example.com)のようにMarkdown形式でリンクを貼ってください。

# 参考ドキュメントの形式
---
page_content: ドキュメントの内容です。これをもとに回答してください。
source_url: 参考URLです。URLは回答に含めてください。
---

# 参考ドキュメント
{context}

# 質問
{question}`;

const promptTempl = ChatPromptTemplate.fromTemplate(TEMPLATE);

const combineDocumentsFn = (docs: Document[]) => {
	// concatinates the page_content and source_url (if exists in metadata) of each document
	const serializedDocs = docs.map((doc) => {
		const sourceUrl = doc.metadata.source_url
			? `source_url: ${doc.metadata.source_url}\n\n`
			: "";
		return `---\npage_content:${doc.pageContent}\n\n${sourceUrl}---`;
	});
	return serializedDocs.join("\n\n");
};

export async function POST(req: NextRequest) {
	const { prompt } = await req.json();

	const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
	const pinecone = new PineconeClient();
	const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX ?? "");
	if (!process.env.PINECONE_INDEX) {
		throw new Error("PINECONE_INDEX environment variable is not set");
	}
	const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
		pineconeIndex,
		maxConcurrency: 5,
	});
	const retriever = vectorStore.asRetriever({ k: 5 });
	const retrievalChain = retriever.pipe(combineDocumentsFn);
	const llm = new ChatGoogleGenerativeAI({
		model: "gemini-2.0-flash-exp",
		temperature: 0,
	});
	const ragChain = RunnableSequence.from([
		{
			context: retrievalChain,
			question: new RunnablePassthrough(),
		},
		promptTempl,
		llm,
		new StringOutputParser(),
	]);

	const stream = await ragChain.stream(prompt);
	return LangChainAdapter.toDataStreamResponse(stream);
}
