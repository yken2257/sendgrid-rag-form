import { type NextRequest, NextResponse } from "next/server";
import { Client } from "langsmith";

export const runtime = "edge";

export async function POST(req: NextRequest) {
	const { fb, runId } = await req.json();

	const client = new Client();

	const feedback = await client.createFeedback(runId, "feedback-key", {
		score: fb,
		comment: "comment",
	});

	return NextResponse.json({ success: true, id: feedback.id }, { status: 200 });
}
