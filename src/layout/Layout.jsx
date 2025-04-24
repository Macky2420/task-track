import React from 'react'
import { useOutlet } from 'react-router-dom'

const Layout = () => {
  const outlet = useOutlet();
  return (
    <div>{outlet}</div>
  )
}

export default Layout