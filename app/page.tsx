import RagForm from "@/components/RagForm";

export default function Page() {
	return (
		<div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg">
			<h1 className="text-2xl font-normal mb-8 text-center">
				SendGridについてAIに質問
			</h1>

			<div className="space-y-6">
				<div className="space-y-4">
					<RagForm />
				</div>
			</div>
		</div>
	);
}
