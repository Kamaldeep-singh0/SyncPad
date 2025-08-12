import React from 'react'

function Button({text}:{text:string}) {
  return (
    <button className='bg-blue-500 rounded-lg p-2 text-white font-medium '>
     {text}
    </button>
  )
}

export default Button
