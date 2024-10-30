import React from 'react'

const Button = ({ type, data, click, newStyle}) => {
  let style = `text-lg bg-gray-400 pt-2 pb-2 p-8 rounded-lg hover:bg-gray-800 hover:text-white`;
  return (
    <div>
      <button className={newStyle !== undefined ? newStyle : style} type={type} onClick={click}>{data}</button>
    </div>
  )
}

export default Button;