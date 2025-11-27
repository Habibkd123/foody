import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query ?q=" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_API_KEY!;
  const cx = process.env.NEXT_PUBLIC_GOOGLE_CSE_ID!;

  if (!apiKey || !cx) {
    return NextResponse.json(
      { error: "Missing GOOGLE_API_KEY or NEXT_PUBLIC_GOOGLE_CSE_ID env vars" },
      { status: 500 }
    );
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = await res.json();

  return NextResponse.json(data);
}
