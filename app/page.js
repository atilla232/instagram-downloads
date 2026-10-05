"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Gagal memproses link Instagram");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800">
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            Instagram Reels Downloader
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Download Reels & Video Instagram MP4 HD / Audio Gratis
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleDownload} className="flex flex-col gap-4">
          <input
            type="url"
            placeholder="Tempel link Instagram Reels di sini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition placeholder-slate-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-90 font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-pink-600/20 active:scale-98 disabled:opacity-50 text-sm">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Memproses Reels...
              </span>
            ) : (
              "Download Reels"
            )}
          </button>
        </form>

        {/* Pesan Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Hasil Download */}
        {result && (
          <div className="mt-8 flex flex-col items-center border-t border-slate-800 pt-6">
            {result.cover && (
              <img
                src={result.cover}
                alt="Reels Thumbnail"
                className="w-44 h-56 object-cover rounded-2xl mb-4 shadow-xl border border-slate-700"
              />
            )}

            <p className="text-xs text-slate-300 text-center line-clamp-2 mb-6 px-4">
              {result.title}
            </p>

            {/* Tombol Aksi Download Langsung */}
            <div className="flex flex-col w-full gap-3">
              {result.downloads.mp4_video && (
                <a
                  href={`/api/proxy-download?url=${encodeURIComponent(result.downloads.mp4_video)}&filename=instagram_reel.mp4`}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-center font-medium py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Video MP4
                </a>
              )}

              {result.downloads.hd_video && (
                <a
                  href={`/api/proxy-download?url=${encodeURIComponent(result.downloads.hd_video)}&filename=instagram_reel_hd.mp4`}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-center font-medium py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Download Video HD
                </a>
              )}

              {result.downloads.music_mp3 && (
                <a
                  href={`/api/proxy-download?url=${encodeURIComponent(result.downloads.music_mp3)}&filename=instagram_audio.mp3`}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-center font-medium py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2"></path>
                  </svg>
                  Download Audio (MP3)
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
