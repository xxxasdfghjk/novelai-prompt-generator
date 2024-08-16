import { Directory, ImageFile } from '@/types/File'
import path from 'path'
import fs from 'fs'
export const searchFiles = (
  dirPath: string,
  rootPath: string
): (Directory | ImageFile)[] => {
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true })
  const files = []
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name)
      const children = searchFiles(fp, rootPath)
      files.push({
        type: 'directory' as const,
        name: dirent.name,
        files: children,
        path: path.join(path.relative(rootPath, dirent.path), dirent.name)
      })
    } else if (
      dirent.isFile() &&
      ['.png', 'jpeg', 'jpg'].includes(path.extname(dirent.name))
    ) {
      files.push({
        type: 'file' as const,
        name: dirent.name,
        path: path.join(path.relative(rootPath, dirent.path), dirent.name)
      })
    }
  }
  return files.toSorted((e1, e2) =>
    e1.type === e2.type
      ? e1.name < e2.name
        ? 1
        : -1
      : e1.type === 'directory'
        ? -1
        : 1
  )
}
