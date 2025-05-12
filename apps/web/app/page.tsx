import React from 'react'
import NavBar from '../components/ui/NavBar'

function page() {
  return (
    <div>
      <NavBar/>
      <div className='h-screen max-w-full grid grid-cols-2  p-20 '>
        <div className='flex flex-col justify-center justify-items-center'>
          <h1 className='text-5xl font-bold mb-3'>Real-time Collaboration for Teams</h1>
          <h2 className='text-xl text-zinc-600 pr-36 mb-3'>SyncPad brings your team together with shared documents and whiteboards. Edit markdown, draw together, and collaborate in real-time.</h2>
           <div className='grid grid-cols-2 gap-3 '>
         <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-md">
        Get Started
       </button>
        
    
      </div>
        </div>
      </div>
    </div>
  )
}

export default page
