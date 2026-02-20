"use client";

import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';

export default function GhostwriterPage() {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLetter = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ resume, jd }),
      });
      const data = await res.json();
      setResult(data.text);
    } catch (err) {
      alert("Error generating cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100">
      {/* Header - Hizaki Style */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-700 tracking-tight font-display">
            Hizaki <span className="text-gray-900 font-light">Labs</span>
          </span>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Ghostwriter</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Resume Auditor</span>
          </nav>
        </div>
      </header>

      {/* Hero Section - Hizaki Style */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 md:py-24 text-center rounded-b-[2rem] shadow-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display leading-tight">
            Cover Letter Ghostwriter
          </h1>
          <p className="text-lg opacity-90 mb-0 max-w-2xl mx-auto">
            Leverage Gemini AI to map your unique skills to any job description. 
            Professional, persuasive, and 100% hallucination-free.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Inputs Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  1. Paste Your Resume
                </label>
                <textarea 
                  className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
                  placeholder="Paste CV content here..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  2. Paste Job Description
                </label>
                <textarea 
                  className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
                  placeholder="Paste the job requirements here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
              </div>

              <button 
                onClick={generateLetter}
                disabled={loading || !resume || !jd}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-full shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {loading ? "Writing your story..." : "Generate Cover Letter"}
              </button>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 font-display">Generated Draft</h2>
              {result && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              )}
            </div>
            
            <div className="flex-grow bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[400px]">
              {result ? (
                <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed font-serif">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 opacity-20" />
                  </div>
                  <p>Your tailored cover letter will appear here.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer - Hizaki Style */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-indigo-400 font-display font-bold text-xl mb-2">Hizaki Labs</p>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Innovation Meets Expertise.</p>
        </div>
      </footer>

      {/* Space Grotesk Font Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
}