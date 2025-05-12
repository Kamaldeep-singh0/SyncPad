import React from 'react'

function Button({text}:{text:string}) {
  return (
    <Button className='bg-blue-500 rounded-lg p-2 text-white font-medium '>
     {text}
    </Button>
  )
}

export default Button
