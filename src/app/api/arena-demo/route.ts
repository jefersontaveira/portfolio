import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "status";

    if (action === "reset") {
      const res = await fetch("http://127.0.0.1:8000/demo/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default: status check
    const res = await fetch("http://127.0.0.1:8000/demo/status/", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ status: "offline" }, { status: 503 });
  } catch (error: any) {
    return NextResponse.json(
      { status: "offline", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/demo/status/", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ status: "offline" });
  } catch {
    return NextResponse.json({ status: "offline" });
  }
}
