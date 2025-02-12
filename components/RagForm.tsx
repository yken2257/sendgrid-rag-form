"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, ThumbsUp, ThumbsDown } from "lucide-react";

import { useCompletion } from "ai/react";
import { MemoizedMarkdown } from "@/components/memorized-markdown";
import InfoDialog from "@/components/InfoDialog";

import { v4 as uuidv4 } from "uuid";

export default function RagForm() {
	const [traceId, setTraceId] = useState(() => uuidv4());
	const [sending, setSending] = useState(false);
	const [sentFeedback, setSentFeedback] = useState(false);

	const handleFeedback = async (fb: number, runId: string) => {
		setSending(true);
		const res = await fetch("/api/feedback", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ fb, runId }),
		});
		if (res.ok) {
			setSentFeedback(true);
			setSending(false);
		}
		if (!res.ok) {
			throw new Error("Feedback submission failed");
		}
	};

	const {
		completion,
		setCompletion,
		input,
		setInput,
		handleInputChange,
		handleSubmit,
		error,
		data,
		isLoading,
	} = useCompletion({
		api: "/api",
		body: { runId: traceId },
	});

	return (
		<>
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
				<div className="flex flex-wrap items-center gap-2 mt-8 mb-16 justify-center">
					<Button
						type="submit"
						variant="outline"
						disabled={isLoading || !input || !!completion}
						className={
							isLoading
								? "bg-slate-500 text-white text-base border-none w-full sm:w-1/4 whitespace-nowrap"
								: "bg-orange-500 hover:bg-orange-600 text-white text-base border-none w-full sm:w-1/4 whitespace-nowrap"
						}
					>
						{isLoading ? (
							<LoaderCircle className="animate-spin w-6 h-6" />
						) : (
							"AIに聞いてみる"
						)}
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={isLoading || !completion}
						onClick={() => {
							setCompletion("");
							setInput("");
							setTraceId(uuidv4());
							setSentFeedback(false);
						}}
						className="bg-gray-500 hover:bg-gray-600 text-white text-base border-none w-full sm:w-auto whitespace-nowrap"
					>
						リセット
					</Button>
					<InfoDialog />
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
					<div className="space-y-4">
						<div className="prose bg-gray-100 rounded-lg p-4 break-all">
							<MemoizedMarkdown content={completion} />
						</div>
						<div className="flex gap-4 justify-center">
							{sentFeedback ? (
								<div className="text-green-600">
									フィードバックありがとうございました
								</div>
							) : sending ? (
								<LoaderCircle className="animate-spin w-6 h-6" />
							) : (
								<>
									<Button
										variant="outline"
										onClick={() => handleFeedback(1, traceId)}
										className="flex items-center gap-2"
									>
										<ThumbsUp />
									</Button>
									<Button
										variant="outline"
										onClick={() => handleFeedback(-1, traceId)}
										className="flex items-center gap-2"
									>
										<ThumbsDown />
									</Button>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
