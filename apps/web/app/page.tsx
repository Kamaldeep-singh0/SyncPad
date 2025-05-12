import React from 'react'
import NavBar from '../components/ui/NavBar'

function page() {
  return (
    <div>
      <NavBar/>
      <div className='h-screen max-w-full grid grid-cols-2 p-20'>
        <div className='flex flex-col justify-center justify-items-center'>
          <h1 className='text-5xl font-bold mb-3'>Real-time Collaboration for Teams</h1>
          <h2 className='text-xl text-zinc-600 pr-36 mb-3'>SyncPad brings your team together with shared documents and whiteboards. Edit markdown, draw together, and collaborate in real-time.</h2>
          <div className='grid grid-cols-2 gap-3'>
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
    </div>
  )
}

export default page