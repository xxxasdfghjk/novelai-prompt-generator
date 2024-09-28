import { Directory, ImageFile } from '@/types/File'
import { Breadcrumbs, Button, Dialog } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { deleteFiles } from '@/app/actions/deleteFiles'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
type Props = {
  path: string
  fileList: (ImageFile | Directory)[]
  onClickDirectory: (path: string) => void
  onClickFile: (file: ImageFile) => void
  onSuccessDelete: () => void
}

const FileImageList = (props: Props) => {
  const [selectedFiles, setSelectedFiles] = useState<Record<string, boolean>>(
    {}
  )
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setSelectedFiles({})
  }, [])
  const breadCrumbs =
    props.path === '/'
      ? []
      : [
          { name: 'Home', path: '/' },
          ...props.path
            .split('/')
            .reduce<
              { name: string; path: string }[]
            >((prev, cur) => [...prev, { name: cur, path: [...prev.map((e) => e.name), cur].join('/') }], [])
        ]
  const onClickDelete = () => {
    setOpen(true)
  }
  const [state, deleteFilesAction] = useFormState(deleteFiles, {
    state: 'initial'
  } as const)
  const router = useRouter()
  const buttonDisabled = useMemo(
    () =>
      Object.entries(selectedFiles).filter(([_, checked]) => checked).length ===
      0,
    [selectedFiles]
  )
  useEffect(() => {
    if (state.state === 'success') {
      toast.success('file delete success!')
      router.refresh()
      setOpen(false)
      props.onSuccessDelete()
      setSelectedFiles({})
    } else if (state.state === 'error') {
      toast.error('file delete failed.')
    }
  }, [state])
  return (
    <div className="flex flex-col items-center">
      <section>
        <Breadcrumbs aria-label="breadcrumb" className="p-4 text-slate-100">
          {breadCrumbs.map((e) => (
            <div key={e.name} onClick={() => props.onClickDirectory(e.path)}>
              {e.name}
            </div>
          ))}
        </Breadcrumbs>
      </section>
      <section className="max-h-[80vh] overflow-y-scroll pb-4 px-4 relative">
        <div>
          {props.fileList.map((e) =>
            e.type === 'file' ? (
              <div className="relative" key={e.name}>
                <div className="absolute left-2 top-2">
                  <label className="flex flex-row items-center justify-center bg-gray-50 rounded-md text-slate-900 p-2 opacity-50 cursor-pointer">
                    <input
                      id="delete"
                      type="checkbox"
                      className="bg-gray-100 bg-opacity-50 w-6 h-6 rounded-3xl opacity-80 p-2"
                      checked={selectedFiles[e.path]}
                      onChange={(event) =>
                        setSelectedFiles((prev) => ({
                          ...prev,
                          [e.path]: event.target.checked
                        }))
                      }
                    />
                    <p className="p-2">Delete</p>
                  </label>
                </div>
                <Image
                  onClick={() => props.onClickFile(e)}
                  width={200}
                  height={300}
                  src={`http://localhost:3000/api/image?imagePath=${e.path}`}
                  alt={e.name}
                />
                <div className="absolute bottom-0 z-20 text-slate-800">
                  {e.name}
                </div>
              </div>
            ) : (
              <div
                key={e.name}
                className="font-bold"
                onClick={() => props.onClickDirectory(e.path)}
              >
                {e.name}
              </div>
            )
          )}
        </div>
        <div className="sticky -bottom-7 z-50 flex justify-center flex-row items-center">
          <button
            className={`w-full rounded-xl bg-red-500 pt-2 pb-3 ${buttonDisabled ? 'opacity-50' : ''}`}
            onClick={() => onClickDelete()}
            disabled={buttonDisabled}
          >
            File Delete
          </button>
        </div>
      </section>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form className="p-4" action={deleteFilesAction}>
          <div className="pb-2">Delete Below Image</div>
          {Object.entries(selectedFiles)
            .filter(([_, checked]) => checked)
            .map(([path, _], i) => (
              <>
                <input hidden value={path} name={`files[${i}]`} />
                <Image
                  key={path}
                  width={300}
                  height={300}
                  src={`http://localhost:3000/api/image?imagePath=${path}`}
                  alt={path}
                />
              </>
            ))}
          <div className="flex flex-row justify-center p-2">
            <Button className="w-full h-24" type="submit" variant="contained">
              CONFIRM
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default FileImageList
