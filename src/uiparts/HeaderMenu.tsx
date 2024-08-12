import React from 'react'
import Link from 'next/link'
type HeaderContentProps = {
  link: string
  title: string
  selected?: boolean
}
const HeaderContent = ({ link, title, selected }: HeaderContentProps) => {
  return (
    <Link
      href={link}
      className={`bg-slate-600 grow-[1] p-4 flex justify-center hover:opacity-70 transition-duration: 150ms cursor-pointer ${selected ? 'bg-slate-800' : ''}`}
    >
      {title}
    </Link>
  )
}

const MENU = [
  {
    link: '/generate',
    title: 'Generate'
  },
  {
    link: '/wild-card-generator',
    title: 'Wild Card'
  },
  {
    link: '/template-generator',
    title: 'Template'
  },
  {
    link: '/variables',
    title: 'Variables'
  },
  {
    link: '/settings',
    title: 'Setting'
  }
] as const

type HeaderMenuProps = {
  selected?: (typeof MENU)[number]['title']
}
const HeaderMenu = ({ selected }: HeaderMenuProps) => {
  return (
    <section className="flex flex-row grow-[1]">
      {MENU.map((e) => (
        <HeaderContent
          key={e.title}
          link={e.link}
          title={e.title}
          selected={selected === e.title}
        />
      ))}
    </section>
  )
}

export default HeaderMenu
