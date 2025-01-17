import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export default function InfoDialog() {
	return (
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
						AIがあなたの質問内容を分析し、公式されている「よくあるご質問」やドキュメントをもとに回答を生成します。
					</DialogDescription>
					<div className="mt-4">
						<ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
							<li>
								AIの生成文章には不正確な表現が含まれる可能性があります。併せて提示される公式ドキュメントもご確認ください。
							</li>
							<li>
								AIによる回答に疑問点がある場合や、問題が解決しない場合はサポートまでお問い合わせください。
							</li>
						</ul>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
