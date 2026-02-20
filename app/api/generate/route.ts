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
    // 1. Initialize the new SDK correctly
    const ai = new GoogleGenAI({ apiKey });

    const { resume, jd } = await req.json();

    if (!resume || !jd) {
      return NextResponse.json(
        { error: "Both resume and job description are required." },
        { status: 400 }
      );
    }

    const prompt = `
      JOB DESCRIPTION:
      ${jd}

      USER RESUME:
      ${resume}
    `;

    // 2. NEW SDK SYNTAX: Use ai.models.generateContent directly
    // You can swap 'gemini-2.5-flash' to 'gemini-3.0-flash' when needed!
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert career coach and professional ghostwriter for Hizaki Labs. Write a persuasive, concise cover letter mapping the user's resume strictly to the job description without hallucinating skills.",
        temperature: 0.7, // Keeps the AI creative but grounded in the resume
      }
    });

    if (!response.text) {
      throw new Error("No content generated.");
    }

    return NextResponse.json({ text: response.text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please check your API key permissions and model access." },
      { status: 500 }
    );
  }
}