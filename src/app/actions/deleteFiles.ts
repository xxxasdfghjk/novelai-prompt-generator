'use server'

import { formDataToObject } from '@/utils/formData'
import path from 'path'
import { z } from 'zod'
import fs from 'fs'

export type State =
  | {
      state: 'initial' | 'error'
    }
  | {
      state: 'success'
    }

const deleteFilesSchema = z.object({
  files: z.array(z.string())
})

export const deleteFiles = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  const formObject = formDataToObject(formData)
  const parsed = deleteFilesSchema.safeParse(formObject)
  if (!parsed.success) {
    console.error(parsed.error)
    return { state: 'error' }
  }
  const { files } = parsed.data
  try {
    for (const file of files) {
      const filePath = path.resolve(path.join(process.env.ROOT_DIR!, file))
      if (
        !filePath.startsWith(process.env.ROOT_DIR!) ||
        !['.png', '.jpeg', '.jpg'].includes(path.extname(filePath))
      ) {
        return { state: 'error' }
      }
      if (!fs.existsSync(filePath)) {
        continue
        return { state: 'error' }
      }
      const targetInfo = fs.statSync(filePath)
      if (targetInfo.isDirectory()) {
        return { state: 'error' }
      }
      fs.unlinkSync(filePath)
    }
    return { state: 'success' }
  } catch (e) {
    console.error(e)
    return { state: 'error' }
  }
}
