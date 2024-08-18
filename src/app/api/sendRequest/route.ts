import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import Admzip from 'adm-zip'
import { getFormattedDate, getFormattedDateTime } from '@/utils/date'
import { RequestPayload, sendRequest } from '@/utils/request'
export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = (await request.json()) as RequestPayload
  const blob = await sendRequest(payload)
  const folderName =
    payload.parameters.folderName ??
    payload.input
      .split(',')
      .find((e) => e.trim() != '1girl' && e.trim() != '1boy')!
  const prefix = payload.parameters.prefix ?? ''
  const file = Buffer.from(await blob.arrayBuffer())
  const fileName =
    getFormattedDate() +
    '/' +
    folderName.trim().replaceAll(' ', '_') +
    '/' +
    prefix +
    getFormattedDateTime() +
    '.png'
  const filePath = path.join(process.env.ROOT_DIR!, fileName)
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  try {
    const admzip = new Admzip(file)
    const zipEntries = admzip.getEntries()
    zipEntries.forEach((entry) => {
      if (!entry.isDirectory) {
        const fileData = entry.getData()
        fs.writeFileSync(filePath, fileData)
      }
    })
    const relativePath = path.relative(process.env.ROOT_DIR!, filePath)
    const relativeDirPath = path.relative(process.env.ROOT_DIR!, dirPath)
    return new NextResponse(
      JSON.stringify({
        filePath: relativePath,
        name: fileName,
        dirPath: relativeDirPath
      }),
      {
        status: 200,
        statusText: 'ok'
      }
    )
  } catch (e) {
    console.error(e)
    console.error(e)
    return new NextResponse(
      JSON.stringify({
        filePath: '/',
        name: 'error',
        dirPath: '/'
      }),
      {
        status: 200,
        statusText: 'ok'
      }
    )
  }
}
