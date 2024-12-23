"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, LoaderCircle } from "lucide-react";

import { useCompletion } from "ai/react";
import { MemoizedMarkdown } from "@/components/memorized-markdown";

export default function ContactForm() {
	const [file, setFile] = useState<File | null>(null);
	const {
		completion,
		input,
		handleInputChange,
		handleSubmit,
		error,
		data,
		isLoading,
	} = useCompletion({ api: "/api" });

	return (
		<div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg">
			<h1 className="text-2xl font-normal mb-8 text-center">お問い合わせ</h1>

			<div className="space-y-6">
				<div className="space-y-4">
					<form onSubmit={handleSubmit}>
						<div className="flex items-center gap-2 mb-1">
							<Label htmlFor="content">内容</Label>
							<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
								必須
							</span>
						</div>
						<Textarea
							id="content"
							value={input}
							required
							className="min-h-[150px]"
							onChange={handleInputChange}
						/>
						<div className="flex items-center gap-2 mt-8 mb-16 justify-center">
							<Button
								type="submit"
								variant="outline"
								disabled={isLoading || !input}
								className={
									isLoading
										? "bg-slate-500 text-white text-base border-none w-1/3"
										: "bg-orange-500 hover:bg-orange-600 text-white text-base border-none w-1/3"
								}
							>
								{isLoading ? (
									<LoaderCircle className="animate-spin w-6 h-6" />
								) : (
									"まずAIに聞いてみる"
								)}
							</Button>
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-full w-6 h-6 p-0"
									>
										<HelpCircle className="w-4 h-4" />
										<span className="sr-only">AIアシスタントについて</span>
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>AIアシスタントについて</DialogTitle>
										<DialogDescription>
											AIがあなたの質問内容を分析し、関連する回答や解決策を提案します。
										</DialogDescription>
										<div className="mt-4">
											<p className="text-sm text-muted-foreground">
												以下のような支援が可能です：
											</p>
											<ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
												<li>よくある質問への即時回答</li>
												<li>関連するドキュメントの提案</li>
												<li>トラブルシューティングのガイダンス</li>
												<li>具体的な解決手順の提示</li>
											</ul>
										</div>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</div>
					</form>
					<div className="flex items-center mt-8 mb-1">
						{data && (
							<pre className="p-4 text-sm bg-gray-100">
								{JSON.stringify(data, null, 2)}
							</pre>
						)}
						{error && (
							<div className="fixed top-0 left-0 w-full p-4 text-center text-white bg-red-500">
								{error.message}
							</div>
						)}
						{completion && (
							<div className="prose bg-gray-100 rounded-lg p-4">
								<MemoizedMarkdown content={completion} />
							</div>
						)}
					</div>

					<h2 className="text-xl mt-36 text-center">サポートへ送信</h2>
					<div>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<Label htmlFor="subject">件名</Label>
								<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
									必須
								</span>
							</div>
							<Input id="subject" required />
							<p className="text-sm text-gray-500 mt-1">
								サポートからの回答メールの件名として利用します。
							</p>
						</div>
						<div className="flex items-center gap-2 mt-8 mb-1">
							<Label htmlFor="email">メールアドレス</Label>
							<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
								必須
							</span>
						</div>
						<Input id="email" type="email" required />
						<p className="text-sm text-gray-500 mt-1">
							サポートからの回答をお送りするメールアドレスです。法人・団体での利用の場合は所属先ドメインからお問い合わせください。
						</p>
					</div>

					<div>
						<div className="flex items-center gap-2 mb-1">
							<Label htmlFor="pageId">マイページID</Label>
							<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
								必須
							</span>
						</div>
						<Input id="pageId" required />
						<p className="text-sm text-gray-500 mt-1">
							マイページへのログインに使用する ID
							を正確にご入力ください（サブユーザ名やTeammate名ではありません）。導入をご検討中の方は「導入検討中」とご入力ください。
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<Label htmlFor="lastName">姓</Label>
								<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
									必須
								</span>
							</div>
							<Input id="lastName" required />
						</div>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<Label htmlFor="firstName">名</Label>
								<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
									必須
								</span>
							</div>
							<Input id="firstName" required />
						</div>
					</div>

					<div>
						<div className="flex items-center gap-2 mb-1">
							<Label htmlFor="company">会社名</Label>
							<span className="text-xs px-2 py-0.5 bg-gray-500 text-white rounded">
								任意
							</span>
						</div>
						<Input id="company" />
					</div>

					<div>
						<div className="flex items-center gap-2 mb-1">
							<Label htmlFor="subuser">サブユーザ名</Label>
							<span className="text-xs px-2 py-0.5 bg-gray-500 text-white rounded">
								任意
							</span>
						</div>
						<Input id="subuser" />
						<p className="text-sm text-gray-500 mt-1">
							サブユーザに関するお問い合わせの場合、対象のサブユーザ名をご入力ください。
						</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Checkbox id="privacy" required />
							<Label htmlFor="privacy" className="text-sm">
								個人情報の取得に同意する
								<span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded ml-2">
									必須
								</span>
							</Label>
						</div>
						<p className="text-sm text-blue-600">
							<a
								href="https://sendgrid.kke.co.jp/privacypolicy/"
								target="_blank"
								rel="noopener noreferrer"
							>
								プライバシーポリシー
							</a>
						</p>
					</div>

					<div>
						<Label htmlFor="file">添付ファイル</Label>
						<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
							<div className="space-y-1 text-center">
								<svg
									className="mx-auto h-12 w-12 text-gray-400"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 48 48"
									aria-hidden="true"
								>
									<path
										d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<div className="flex text-sm text-gray-600">
									<label
										htmlFor="file-upload"
										className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
									>
										<span>ファイルを選択</span>
										<input
											id="file-upload"
											name="file-upload"
											type="file"
											className="sr-only"
											onChange={(e) => setFile(e.target.files?.[0] || null)}
										/>
									</label>
								</div>
								<p className="text-xs text-gray-500">{file ? file.name : ""}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<Button type="submit" className="bg-blue-500 hover:bg-blue-600">
						サポートへ送信
					</Button>
				</div>

				<div className="text-sm text-gray-500 space-y-4">
					<p>
						送信後、ご入力のメールアドレスにお問い合わせ受付メールをお送りします。
					</p>
					<p>
						メールが届かない場合は、ご入力のアドレスの間違っているか迷惑メールとなっている可能性がございますので、再度フォームよりお問い合わせください（迷惑メールフォルダもご確認ください）。
					</p>
				</div>
			</div>
		</div>
	);
}
