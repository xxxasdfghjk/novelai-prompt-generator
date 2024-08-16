import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import Admzip from 'adm-zip'
import { getFormattedDate, getFormattedDateTime } from '@/utils/date'
export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData()
  const file = Buffer.from(await (formData.get('blob') as Blob).arrayBuffer())
  const fileName = getFormattedDate() + '/' + getFormattedDateTime() + '.png'
  const filePath = path.join(process.env.ROOT_DIR!, fileName)
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
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
}
