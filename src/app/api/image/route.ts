import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
export function GET(request: NextRequest): NextResponse {
  const imagePath = request.nextUrl.searchParams.get('imagePath')
  if (typeof imagePath !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'invalid parameter' }), {
      status: 400
    })
  }
  const filePath = path.join(process.env.ROOT_DIR!, imagePath)
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath)

    // 画像の拡張子に応じたMIMEタイプを設定
    const ext = path.extname(path.basename(filePath)).toLowerCase()
    let contentType
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      default:
        contentType = 'application/octet-stream'
    }
    const headers = new Headers()
    // レスポンスに適切なContent-Typeを設定し、ファイルのバイナリデータを返す
    headers.set('Content-Type', contentType)
    return new NextResponse(fileBuffer, {
      status: 200,
      statusText: 'ok',
      headers
    })
  } else {
    return new NextResponse(JSON.stringify({ error: 'no exist' }), {
      status: 404
    })
  }
}
