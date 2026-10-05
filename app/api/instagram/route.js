import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("instagram.com")) {
      return NextResponse.json(
        { error: "URL Instagram tidak valid." },
        { status: 400 },
      );
    }

    const apiKey =
      process.env.RAPIDAPI_KEY ||
      "07259f2b12mshf8cccb790366960p16a160jsn196528974589";

    // Memanggil API RapidAPI
    const response = await fetch(
      `https://instagram-reels-downloader-api.p.rapidapi.com/download?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "instagram-reels-downloader-api.p.rapidapi.com",
          "x-rapidapi-key": apiKey,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    let videoUrl = null;
    let coverUrl = "";
    let title = "Instagram Reel Video";

    // Parser fleksibel membaca format JSON dari RapidAPI
    if (data) {
      if (typeof data === "string" && data.startsWith("http")) {
        videoUrl = data;
      } else if (Array.isArray(data)) {
        videoUrl = data[0]?.url || data[0]?.download_url || data[0]?.video;
        coverUrl = data[0]?.thumbnail || data[0]?.cover || "";
      } else if (typeof data === "object") {
        const item = data.data || data.result || data;

        if (typeof item === "string" && item.startsWith("http")) {
          videoUrl = item;
        } else if (Array.isArray(item)) {
          videoUrl =
            item[0]?.url || item[0]?.download_url || item[0]?.video || item[0];
          coverUrl = item[0]?.thumbnail || item[0]?.cover || "";
        } else if (typeof item === "object") {
          videoUrl =
            item.download_url ||
            item.video_url ||
            item.url ||
            item.link ||
            item.video ||
            item.media;
          coverUrl =
            item.thumbnail ||
            item.cover ||
            item.display_url ||
            item.picture ||
            "";
          title = item.title || item.caption || title;
        }
      }
    }

    if (videoUrl) {
      return NextResponse.json({
        success: true,
        title: title,
        cover: coverUrl,
        downloads: {
          mp4_video: videoUrl,
          hd_video: videoUrl,
          music_mp3: videoUrl,
        },
      });
    }

    return NextResponse.json(
      {
        error:
          "Gagal mengambil video dari RapidAPI. Pastikan link Reels publik.",
      },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem pada backend." },
      { status: 500 },
    );
  }
}
