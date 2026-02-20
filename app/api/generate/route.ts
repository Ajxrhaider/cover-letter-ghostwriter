import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  // 1. Grab the API Key safely
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not defined in environment variables." },
      { status: 500 }
    );
  }

  try {
    // 2. Initialize the SDK inside the handler or with explicit typing
    const genAI = new GoogleGenAI(apiKey);
    
    // 3. Get the model using the configuration object
    // We use gemini-1.5-flash as it's the current stable high-speed model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const { resume, jd } = await req.json();

    if (!resume || !jd) {
      return NextResponse.json(
        { error: "Resume and Job Description are required." },
        { status: 400 }
      );
    }

    const systemPrompt = `
      You are an expert technical recruiter and professional ghostwriter for Hizaki Labs.
      Your goal is to write a high-conversion cover letter.
      
      RULES:
      - Match skills from the Job Description STRICTLY to the provided Resume.
      - NEVER invent skills, certifications, or experience.
      - Maintain a professional, innovative, and confident tone.
      - Format as a clean business letter.
    `;

    const userPrompt = `
      JOB DESCRIPTION:
      ${jd}

      RESUME:
      ${resume}
    `;

    // 4. Generate content with a combined system + user instruction
    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}