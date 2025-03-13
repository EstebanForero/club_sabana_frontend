
import { Link } from '@tanstack/react-router'
import React from 'react'

const NavBarComponent = () => {
  return (
    <div className="p-2 flex gap-2 text-lg absolute">
      <Link
        to="/"
        activeProps={{
          className: 'font-bold',
        }}
        activeOptions={{ exact: true }}
      >
        Home
      </Link>{' '}
      <Link
        to="/auth/login"
        activeProps={{
          className: 'font-bold',
        }}
        activeOptions={{ exact: true }}
      >
        Login
      </Link>{' '}
      <Link
        to="/auth/signin"
        activeProps={{
          className: 'font-bold',
        }}
        activeOptions={{ exact: true }}
      >
        Register
      </Link>{' '}

    </div>

  )
}

export default NavBarComponent
