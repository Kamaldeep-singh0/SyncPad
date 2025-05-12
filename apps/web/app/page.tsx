import React from 'react'
import NavBar from '../components/ui/NavBar'

function page() {
  return (
    <div>
      <NavBar/>
      <div className='h-screen max-w-full grid grid-cols-2 bg-amber-200 p-20 '>
        <div className='flex flex-col justify-center justify-items-center'>
          <h1 className='text-5xl font-bold'>Real-time Collaboration for Teams</h1>
          <h2 className='text-xl text-zinc-600 pr-60'>SyncPad brings your team together with shared documents and whiteboards. Edit markdown, draw together, and collaborate in real-time.</h2>
           <div className='grid grid-cols-2 gap-3 '>
         <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md">
        Login
       </button>
        <button className=' hover:bg-purple-500 rounded-md py-2 px-4 hover:text-white font-semibold '>
        Sign Up
       </button>
    
      </div>
        </div>
      </div>
    </div>
  )
}

export default page
