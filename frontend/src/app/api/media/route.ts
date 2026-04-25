import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filepath = searchParams.get('path');
  
  if (!filepath) return new NextResponse('No path provided', { status: 400 });
  
  try {
    // Basic validation to ensure we're serving media files
    const ext = path.extname(filepath).toLowerCase();
    let contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';
    
    const fileBuffer = readFileSync(filepath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error("Error reading file:", e);
    return new NextResponse('File not found', { status: 404 });
  }
}
