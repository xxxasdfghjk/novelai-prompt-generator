import React, { ReactNode } from 'react'

const SideBarTitle = ({ title }: { title: string }) => {
  return <h1 className="p-2 text-xl font-bold">{title}</h1>
}

type SideBarProps = {
  title: string
  children: ReactNode
  minWidth?: string
}
const SideBar = ({ title, children, minWidth }: SideBarProps) => {
  return (
    <div
      className={`overflow-y-scroll overflow-x-scroll p-4 bg-slate-700 h-screen min-w-[${minWidth ?? 25}%]`}
    >
      <SideBarTitle title={title} />
      <section>{children}</section>
    </div>
  )
}

export default SideBar
