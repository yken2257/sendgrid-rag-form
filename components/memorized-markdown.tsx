import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

function parseMarkdownIntoBlocks(markdown: string): string[] {
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

const CustomLink = ({
	children,
	href,
}: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
	return (
		<a
			className="text-blue-600"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</a>
	);
};

const CustomBulletList = ({
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>>) => {
	return (
		<ul className="list-disc list-inside" {...props}>
			{children}
		</ul>
	);
};

const CustomNumberedList = ({
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLOListElement>>) => {
	return (
		<ol className="list-decimal list-inside" {...props}>
			{children}
		</ol>
	);
};

const CustomCodeBlock = ({
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => {
	return (
		<pre className="bg-gray-100 p-4 rounded-md" {...props}>
			{children}
		</pre>
	);
};

const CustomInlineCode = ({
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => {
	return (
		<code className="bg-gray-100 p-1 rounded-md" {...props}>
			{children}
		</code>
	);
};

const MemoizedMarkdownBlock = memo(
	({ content }: { content: string }) => {
		return (
			<ReactMarkdown
				components={{
					a: CustomLink,
					ul: CustomBulletList,
					ol: CustomNumberedList,
					pre: CustomCodeBlock,
					code: CustomInlineCode,
				}}
			>
				{content}
			</ReactMarkdown>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) return false;
		return true;
	},
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(({ content }: { content: string }) => {
	const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

	function createHash(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return hash.toString(16);
	}

	return blocks.map((block, index) => (
		<MemoizedMarkdownBlock content={block} key={`${createHash(block)}-${index}`} />
	));
});

MemoizedMarkdown.displayName = "MemoizedMarkdown";
