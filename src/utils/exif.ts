import ExifReader from 'exifreader'

export const getExifData = async (arrayBuffer: ArrayBuffer) => {
  return ExifReader.load(arrayBuffer, { expanded: true })
}
