import { Directory, ImageFile } from '@/types/File'
import { Breadcrumbs } from '@mui/material'
import React, { Fragment } from 'react'
import Image from 'next/image'
type Props = {
  path: string
  fileList: (ImageFile | Directory)[]
  onClickDirectory: (path: string) => void
  onClickFile: (file: ImageFile) => void
}

const FileImageList = (props: Props) => {
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
      <section className="max-h-[80vh] overflow-y-scroll pb-4 px-4">
        {props.fileList.map((e) =>
          e.type === 'file' ? (
            <Fragment key={e.name}>
              <Image
                onClick={() => props.onClickFile(e)}
                width={200}
                height={300}
                src={`http://localhost:3000/api/image?imagePath=${e.path}`}
                alt={e.name}
              />
            </Fragment>
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
      </section>
    </div>
  )
}

export default FileImageList
