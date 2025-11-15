import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      prompt,
      message,
      persona = 'balanced', // 'budget' | 'luxury' | 'balanced'
      categories = [],     // e.g. ['fruits','snacks']
      maxPrice,            // optional number
      dietary = [],        // e.g. ['vegan','gluten-free']
      locale = 'en-IN',
    } = body as any;

    const userMsg = message || prompt || 'Help me find great grocery deals.';

    const system = `You are Foody Assistant, a friendly in-app shopping guide for a grocery/e-comm app in ${locale}.
Focus on:
- Budget-friendly picks when persona=budget; premium/luxury picks when persona=luxury; sensible value for balanced.
- Suggest best current offers, combos, and substitutions that reduce cost but keep quality.
- If categories provided, prioritize items from them; if maxPrice provided, keep total suggestions within it.
- Respect dietary tags when present (vegan/veg/halal/gluten-free/keto etc.).
- Keep answers concise, bullet-style, and action-oriented with clear item + short reason.
- Ask 1 clarifying question only if critical info is missing.
Respond in a helpful, upbeat tone.`;

    const toolHint = `Context:
persona=${persona}; categories=${Array.isArray(categories)?categories.join(', '):categories}; maxPrice=${maxPrice ?? 'n/a'}; dietary=${Array.isArray(dietary)?dietary.join(', '):dietary}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `${toolHint}\n\n${userMsg}` },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: 'OpenAI request failed' }, { status: 500 });
  }
}