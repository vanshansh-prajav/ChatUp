import React from 'react'

const Message = ({message, time, owner}) => {
  let style = `flex flex-col border pb-1 pl-4 pr-4 max-w-[60%] rounded-lg
  ${owner ? 
  "bg-cyan-700  self-start" :
  "bg-teal-700  self-end" }`;  
  return (
    <div className={style}>
      <p className='text-lg items-center break-normal'>
        {message}
      </p>
      <div className='text-[10px] self-end'>
        {time}
      </div>
    </div>
  )
}

export default Message