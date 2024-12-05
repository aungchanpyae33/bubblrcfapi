export const runtime = "edge";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("with");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter 'with' is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const upstreamResponse = await fetch(query);

    const modifiedResponse = new Response(
      upstreamResponse.body,
      upstreamResponse
    );

    modifiedResponse.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    return modifiedResponse;
  } catch (error) {
    console.error("Error fetching data:", error);

    return new Response(
      JSON.stringify({ error: "Error fetching data from upstream" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
