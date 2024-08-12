import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { searchFiles } from '@/utils/file'
export function GET(request: NextRequest): NextResponse {
  const imagePath = path.join(
    process.env.ROOT_DIR!,
    request.nextUrl.searchParams.get('imagePath') ?? '/'
  )
  return new NextResponse(
    JSON.stringify(searchFiles(imagePath, process.env.ROOT_DIR!)),
    {
      status: 200,
      statusText: 'ok'
    }
  )
}
