import React, { ReactNode } from 'react'

const SideBarTitle = ({ title }: { title: string }) => {
  return <h1 className="p-2 text-xl font-bold">{title}</h1>
}

type SideBarProps = {
  title: string
  children: ReactNode
}
const SideBar = ({ title, children }: SideBarProps) => {
  return (
    <div className="overflow-y-scroll overflow-x-scroll p-4 bg-slate-700 h-screen min-w-[25%]">
      <SideBarTitle title={title} />
      <section>{children}</section>
    </div>
  )
}

export default SideBar
