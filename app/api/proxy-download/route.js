import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "instagram_video.mp4";

  if (!fileUrl) {
    return new NextResponse("URL file tidak ditemukan.", { status: 400 });
  }

  try {
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!response.ok) {
      return new NextResponse("Gagal mengambil file dari server asal.", {
        status: 500,
      });
    }

    const contentType = response.headers.get("content-type") || "video/mp4";
    const arrayBuffer = await response.arrayBuffer();

    // Mengembalikan file dengan header memaksa unduh file langsung ke storage
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return new NextResponse("Terjadi kesalahan saat memproses unduhan.", {
      status: 500,
    });
  }
}
