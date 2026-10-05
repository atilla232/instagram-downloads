import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'instagram_video.mp4';

  if (!fileUrl) {
    return new NextResponse('URL file tidak ditemukan.', { status: 400 });
  }

  try {
    // Panggil CDN Instagram dengan Header Lengkap
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      return new NextResponse('Gagal mengambil file dari CDN Instagram.', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || '';

    // Cegah menyimpan teks/HTML error menjadi file MP4
    if (contentType.includes('text/html') || contentType.includes('application/json')) {
      return new NextResponse('Link video sudah kadaluarsa atau diblokir oleh CDN Instagram.', { status: 403 });
    }

    // Stream response body langsung tanpa batas memori arrayBuffer
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType || 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Terjadi kesalahan saat memproses unduhan.', { status: 500 });
  }
}
