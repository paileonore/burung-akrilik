import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Database, RefreshCw, Star, AlertCircle } from 'lucide-react';

// API KEY GROQ LO LANGSUNG GUE PASANG DI SINI
const response = await fetch('/api/news');
const result = await response.json();"; 

const App = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const generateDailyNews = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "Anda adalah jurnalis masa depan media 'Burung Akrilik'. Berikan 3 berita masa depan singkat berbasis fakta dalam format JSON: {\"news\": [{\"id\": 1, \"category\": \"TEKNOLOGI\", \"title\": \"...\", \"summary\": \"...\", \"confidence\": 95, \"source\": \"...\"}]}. Gunakan Bahasa Indonesia."
            },
            {
              role: "user",
              content: "Berikan laporan hari ini."
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const result = await response.json();
      
      if (result.choices && result.choices[0].message.content) {
        const content = JSON.parse(result.choices[0].message.content);
        setNews(content.news || []);
      } else {
        throw new Error("Gagal mengambil data dari Groq.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Koneksi bermasalah. Pastikan API Key aktif.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateDailyNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      {/* Header / Nav */}
      <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.3)]">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">BURUNG AKRILIK</h1>
              <p className="text-[9px] text-blue-400 font-bold tracking-[0.3em] uppercase mt-1">Pai Leonore Studio</p>
            </div>
          </div>
          <button 
            onClick={generateDailyNews}
            className="group flex items-center gap-2 bg-white/5 hover:bg-blue-600 border border-white/10 px-5 py-2.5 rounded-full transition-all duration-500"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Sinkronisasi</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-4xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-8 tracking-[0.2em] uppercase">
            <Star className="w-3 h-3 fill-blue-400" />
            Curated by Pai Leonore
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-8 leading-[0.95] tracking-tighter text-white uppercase">
            Hakikat Data <br/> 
            <span className="text-blue-600 italic">Masa Depan.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed font-light italic border-l-2 border-blue-600 pl-6 py-2">
            "Membangun narasi esok hari tanpa distorsi opini. Setiap pixel divalidasi oleh Pai Leonore."
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-3 p-4 mb-10 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm italic">
            <AlertCircle className="w-5 h-5" />
            {errorMsg}
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="h-96 bg-white/[0.02] rounded-[3rem] border border-white/5 animate-pulse"></div>
            ))
          ) : (
            news.map((item) => (
              <div key={item.id} className="group relative bg-[#0a0f1e] border border-white/5 p-10 rounded-[3rem] hover:border-blue-600/50 transition-all duration-700 flex flex-col hover:bg-[#0c1429] hover:-translate-y-4">
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[9px] font-black tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase">
                    {item.category}
                  </span>
                  <div className="text-right">
                    <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Akurasi</p>
                    <p className="text-xl font-black text-white leading-none">{item.confidence}%</p>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-blue-400 transition-colors duration-500 uppercase">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-12 flex-grow font-light italic">
                  "{item.summary}"
                </p>
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500/80">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Verified</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Brand Footer Section */}
        <div className="relative py-24 flex flex-col items-center justify-center text-center overflow-hidden border-y border-white/5">
          <p className="text-slate-500 uppercase tracking-[0.6em] text-[10px] mb-6 font-bold">Designer & Visionary</p>
          <h3 className="text-5xl md:text-7xl font-extralight tracking-[0.3em] text-white opacity-80 uppercase leading-none">
            PAI LEONORE
          </h3>
          <div className="w-16 h-0.5 bg-blue-600 mt-10"></div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 text-center bg-black/50">
        <p className="text-[9px] text-slate-700 font-black tracking-[0.4em] uppercase">
          &copy; 2026 BURUNG AKRILIK • PAI LEONORE STUDIO
        </p>
      </footer>
    </div>
  );
};

export default App;

