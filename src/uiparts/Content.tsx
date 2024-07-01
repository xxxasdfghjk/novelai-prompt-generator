import React, { ReactNode } from 'react'
type Props = { children: ReactNode }
const Content = ({ children }: Props) => {
  return <div className="grow-[3]">{children}</div>
}

export default Content
