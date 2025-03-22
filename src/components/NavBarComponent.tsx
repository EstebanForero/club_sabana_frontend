
import { Link } from '@tanstack/react-router'
import React from 'react'

const NavBarComponent = () => {
  return (
    <div className="p-2 flex gap-4 text-lg absolute">
      <Link
        to="/"
        activeProps={{
          className: 'bg-primary rounded-md',
        }}
        className='px-2'
        activeOptions={{ exact: true }}
      >
        Home
      </Link>{' '}
      <Link
        to="/auth/login"
        activeProps={{
          className: 'bg-primary rounded-md',
        }}
        className='px-2'
        activeOptions={{ exact: true }}
      >
        Login
      </Link>{' '}
      <Link
        to="/auth/signin"
        activeProps={{
          className: 'bg-primary rounded-md',
        }}
        className='px-2'
        activeOptions={{ exact: true }}
      >
        Register
      </Link>{' '}

    </div>

  )
}

export default NavBarComponent
