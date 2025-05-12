import React from 'react'
import NavBar from '../components/ui/NavBar'
import { FileText, Square, Users } from 'lucide-react'

function page() {
  return (
    <div>
      <NavBar/>
      <div className='h-screen max-w-full grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-20'>
        <div className='flex flex-col justify-center justify-items-center'>
          <h1 className='text-3xl sm:text-5xl font-bold mb-3'>Real-time Collaboration for Teams</h1>
          <h2 className='sm:text-xl text-lg text-zinc-600 sm:pr-36 mb-3'>SyncPad brings your team together with shared documents and whiteboards. Edit markdown, draw together, and collaborate in real-time.</h2>
          <div className='grid grid-cols-2 gap-3 mb-3'>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-white hover:text-black text-white font-semibold py-2 px-4 rounded-md">
              Get Started
            </button>
          </div>
        </div>
        <div className="mx-auto flex w-3/4 items-center justify-center  transition-transform duration-200 ease-in-out hover:scale-[1.01] ">
          <div className="w-full overflow-hidden rounded-lg border border-zinc-100 shadow-xl backdrop-blur">
            <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div className="ml-2 font-medium">Document.md</div>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-zinc-200">
              <div className="p-4 font-mono text-sm">
                <div className="text-muted-foreground"># SyncPad</div>
                <div className="mt-2">
                  A **real-time** collaboration tool for teams.
                </div>
                <div className="mt-4 text-muted-foreground">## Features</div>
                <div className="mt-2">- Markdown editing</div>
                <div>- Shared whiteboard</div>
                <div>- User presence</div>
              </div>
              <div className="p-4 text-sm">
                <div className="text-2xl font-bold">SyncPad</div>
                <div className="mt-2">
                  A <span className="font-bold">real-time</span> collaboration tool for teams.
                </div>
                <div className="mt-4 text-xl font-bold">Features</div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Markdown editing</li>
                  <li>Shared whiteboard</li>
                  <li>User presence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-screen max-w-full '>
         <div className='py-20 px-4 sm:px-20 bg-gray-50'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold mb-4'>Key Features</h2>
          <p className='text-xl text-zinc-600 max-w-3xl mx-auto'>
            Everything you need to collaborate effectively with your team in one place.
          </p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {/* Document Editor */}
          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <FileText size={28} className='text-blue-600' />
            </div>
            <h3 className='text-xl font-bold text-center mb-3'>Document Editor</h3>
            <p className='text-zinc-600 text-center'>
              Collaborative Markdown editor with real-time changes and formatting.
            </p>
          </div>
          
          {/* Shared Whiteboard */}
          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <Square size={28} className='text-blue-600' />
            </div>
            <h3 className='text-xl font-bold text-center mb-3'>Shared Whiteboard</h3>
            <p className='text-zinc-600 text-center'>
              Interactive canvas for diagrams, drawings, and visual collaboration.
            </p>
          </div>
          
          {/* Real-time Presence */}
          <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
            <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto'>
              <Users size={28} className='text-blue-600' />
            </div>
            <h3 className='text-xl font-bold text-center mb-3'>Real-time Presence</h3>
            <p className='text-zinc-600 text-center'>
              See who's online, track cursors, and collaborate in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default page