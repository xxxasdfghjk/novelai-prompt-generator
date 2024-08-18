import { DEFAULT_IMAGE_SIZE } from '@/uiparts/ImageSizeSelector'
import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai/vanilla'

export const promptAtom = atomWithStorage<string>('prompt', '')
export const negativePromptAtom = atomWithStorage<string>('negativePrompt', '')
export const folderNameAtom = atom<string>('')
export const prefixAtom = atom<string>('')
export const seedAtom = atom<number | undefined>(undefined)
export const imageSizeAtom = atom<{ width: number; height: number }>(
  DEFAULT_IMAGE_SIZE
)
