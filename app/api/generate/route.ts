import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// The fix: Pass as an object { apiKey: string }
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  // ... rest of your logic
  try {
    const { resume, jd } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Using the robust 1.5/3.0 flash model
      systemInstruction: `You are an expert full-stack technical recruiter. 
      Your task is to write a professional cover letter.
      - Extract key requirements from the Job Description.
      - Match them STRICTLY to the user's Resume.
      - DO NOT invent skills, years of experience, or projects not found in the resume.
      - Tone: Professional, innovative, and concise.
      - Format: Standard business letter format.`
    });

    const prompt = `JOB DESCRIPTION:\n${jd}\n\nRESUME:\n${resume}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}