"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";

import { useCompletion } from "ai/react";
import { MemoizedMarkdown } from "@/components/memorized-markdown";

export default function RagForm() {
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
			<h1 className="text-2xl font-normal mb-8 text-center">SendGridについてAIに質問</h1>

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
									"AIに聞いてみる"
								)}
							</Button>
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
			  </div>
      </div>
		</div>
	);
}
