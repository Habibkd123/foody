import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { prompt } = req.body;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//     });

//     const reply = completion.choices[0].message.content;
//     res.status(200).json({ reply });
//   } catch (error) {
//     console.error('OpenAI Error:', error);
//     res.status(500).json({ error: 'OpenAI request failed' });
//   }
// }


export async function POST(request: Request) {
  try {
   const { prompt }:any = await request.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: 'OpenAI request failed' }, { status: 500 });
  }
}