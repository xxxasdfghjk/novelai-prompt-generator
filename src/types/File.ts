export type ImageFile = {
  type: 'file'
  name: string
  path: string
}

export type Directory = {
  type: 'directory'
  name: string
  files: (Directory | ImageFile)[]
  path: string
}
