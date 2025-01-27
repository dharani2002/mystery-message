"use client"

import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const Navbar = () => {

    const {data:session}=useSession()
    const router=useRouter()
    
    const user =session?.user as User//session is accessible and we get user details from it not data.user check next auth docs

    const onSubmit=()=>{
        signOut({ callbackUrl: "/sign-in" });
    }


  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a href='#' className="text-xl font-bold mb-4 md:mb-0"> Mystery Message</a>
            {
                session?(
                    <>
                    <span className="mr-4">Welcome,{user?.username|| user?.email}</span>
                    <Button onClick={onSubmit}>Logout</Button>
                    </>
                ):(
                    <Link href='/sign-in'>
                        <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar