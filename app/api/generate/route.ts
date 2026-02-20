import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Internal Server Error: API Key missing" },
      { status: 500 }
    );
  }

  try {
    // Initialize the SDK correctly for TypeScript/Turbopack
    const genAI = new GoogleGenAI({ apiKey });

    const { resume, jd } = await req.json();

    if (!resume || !jd) {
      return NextResponse.json(
        { error: "Both resume and job description are required." },
        { status: 400 }
      );
    }

    // UPDATE HERE: Change to "gemini-3-flash" if you want to use the v3 model instead
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: "You are an expert career coach and professional ghostwriter for Hizaki Labs. Write a persuasive, concise cover letter mapping the user's resume strictly to the job description without hallucinating skills.",
    });

    const prompt = `
      JOB DESCRIPTION:
      ${jd}

      USER RESUME:
      ${resume}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please check your API key permissions and model access." },
      { status: 500 }
    );
  }
}