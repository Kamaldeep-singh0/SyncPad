import React from 'react'


function NavBar() {
  return (
    <div className=' flex justify-between px-7 py-3 border-zinc-200 border-b-1  '>
      <div>
       <h1 className='text-2xl font-bold'>SyncPad</h1>
       
       <img src=""/>
      </div>
      <div className='grid grid-cols-2 gap-3 '>
         <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md">
        Login
       </button>
        <button className=' hover:bg-purple-500 rounded-md py-2 px-4 hover:text-white font-semibold '>
        Sign Up
       </button>
    
      </div>
    </div>
  )
}

export default NavBar
