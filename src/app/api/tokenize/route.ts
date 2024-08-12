import { tokenizer } from './../../../utils/tokenizer'
import { NextRequest, NextResponse } from 'next/server'
export function GET(request: NextRequest): NextResponse {
  const text = request.nextUrl.searchParams.get('text')
  if (typeof text !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'invalid parameter' }), {
      status: 400
    })
  }
  return new NextResponse(
    JSON.stringify({ count: tokenizer.encode(text).length }),
    {
      status: 200,
      statusText: 'ok'
    }
  )
}
