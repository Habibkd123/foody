import { NextResponse } from "next/server";
import axios from "axios";
import connectDB from "@/lib/mongodb";
import Product from "@/app/models/Product";
import ChatLog from "@/app/models/ChatLog";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const messageText = body?.message || body?.prompt || "";
    const chatHistory = body?.chat_history || [];
    const ai_preambleData = body?.ai_preambleData || [];
    const persona = body?.persona || "balanced"; // 'budget' | 'luxury' | 'balanced'
    const categories = Array.isArray(body?.categories) ? body?.categories : undefined;
    const locale = body?.locale || "en-IN";

    if (!messageText) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Basic product availability search (sweets/spicy/masala focused)
    const scopeKeywords = ["sweet", "sweets", "spicy", "masala", "chilli", "chili", "laddu", "barfi", "halwa", "namkeen", "pickle", "achaar"];
    const textQuery = messageText.trim();
    const keywordRegex = new RegExp(scopeKeywords.join("|"), "i");

    const orClauses: any[] = [
      { name: { $regex: textQuery, $options: "i" } },
      { description: { $regex: textQuery, $options: "i" } },
      { tags: { $in: [new RegExp(textQuery, "i")] } },
    ];

    // Ensure we bias results to in-scope items
    const scopeClauses: any[] = [
      { name: { $regex: keywordRegex } },
      { description: { $regex: keywordRegex } },
      { tags: { $in: [keywordRegex] } },
    ];

    const matched = await Product.find({ $and: [ { status: { $ne: "inactive" } }, { $or: orClauses }, { $or: scopeClauses } ] })
      .select("name price inStock stock")
      .limit(6)
      .lean();

    const matchedProducts = (matched || []).map((p: any) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      inStock: typeof p.inStock === "boolean" ? p.inStock : (p.stock ?? 0) > 0,
    }));

    const availability = matchedProducts.length > 0 ? "available" : "unavailable";

    // Build strict domain preamble
    const dynamicCategoryHint = categories && categories.length
      ? `Focus on these categories when relevant: ${categories.join(", ")}. `
      : "";

    const catalogSnippet = matchedProducts.length
      ? `Here are up to ${matchedProducts.length} matching items from our catalog (ID | Name | Price | InStock):\n` +
        matchedProducts.map((p) => `- ${p._id} | ${p.name} | ₹${p.price} | ${p.inStock ? "Yes" : "No"}`).join("\n")
      : `No exact matches found in the catalog for the user's request. Suggest popular sweets/spicy/masala alternatives only.`;

    const storePreamble = `You are the AI assistant for our food shop that sells ONLY sweets, spicy foods, and related masalas.\n
Rules:\n
- Answer ONLY about sweets, spicy foods, and masalas offered by this shop, including product details, ingredients, allergens, availability, pricing (INR), offers, delivery, returns, and support.\n
- If a question is outside this scope (e.g., electronics, clothing, unrelated groceries), politely refuse and redirect to sweets/spicy/masala options.\n
- Do NOT use external knowledge beyond common food safety disclaimers unless explicitly provided by the user.\n
- Keep responses concise, helpful, and user-friendly.\n
- Persona: ${persona}. Tailor tone and recommendations accordingly. ${dynamicCategoryHint}\n
- Locale: ${locale}. Use appropriate wording and INR currency.\n
- If information is unknown or unavailable, say so clearly and suggest alternatives within sweets/spicy/masala.\n
\nCatalog context:\n${catalogSnippet}`;

    // Merge any UI-provided preamble extensions
    const preamble = [
      storePreamble,
      ...(ai_preambleData?.map((item: any) => item?.ai_preamble).filter(Boolean) || [])
    ].join("\n\n");

    // Actual Cohere API call
    const response = await axios.post(
      "https://api.cohere.com/v1/chat",
      {
        message: messageText,
        chat_history: chatHistory,
        model: "command-r-08-2024",
        preamble: preamble,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        },
      }
    );

    const aiReply = response?.data?.text || response?.data?.reply || "";

    // Build quick options for UI
    const quickOptions = availability === "available"
      ? [
          "Add to cart",
          "Show more like this",
          "What are the ingredients?",
          "Any combo offers?",
        ]
      : [
          "Show popular sweets",
          "Show popular spicy snacks",
          "Show masala options",
          "Notify me when available",
        ];

    // Persist chat log
    try {
      await ChatLog.create({
        userMessage: messageText,
        aiReply,
        matchedProducts: matchedProducts.map((p) => ({ _id: p._id, name: p.name, price: p.price, inStock: p.inStock })),
        meta: { availability, persona, locale },
      });
    } catch (e) {
      console.warn("Failed to persist ChatLog:", (e as any)?.message);
    }

    // Return enriched response
    return NextResponse.json({
      reply: aiReply,
      availability,
      matchedProducts,
      quickOptions,
      raw: response.data,
    });

  } catch (error: any) {
    console.error("Cohere API Error:", error?.response?.data || error.message);

    return NextResponse.json(
      { error: error?.response?.data || error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: process.env.COHERE_API_KEY ? "ready" : "not configured",
  });
}
