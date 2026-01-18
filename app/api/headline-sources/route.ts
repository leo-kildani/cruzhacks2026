import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://kildanicruzhacks.app.n8n.cloud/webhook/headline-sources";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { headline, description, date } = body;

    if (!headline || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields: headline, description, date" },
        { status: 400 }
      );
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ headline, description, date }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch sources from n8n" },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("n8n response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in headline-sources API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
