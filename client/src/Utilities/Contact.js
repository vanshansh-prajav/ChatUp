import React, { useContext } from 'react'
import { activeContact } from '../Home'
const Contact = ({ chatId, id, profilePicture, name, latestMessage, setComponentName }) => {
  const setCurrentContact = useContext(activeContact);
  const change = () => {
    setCurrentContact({contactName: name, recipientId: id, profilePicture: profilePicture, chatId});
    setComponentName();
  }
  return (
    <button className='flex border rounded-md gap-2 p-2 items-center bg-slate-600 hover:bg-gray-700' onClick={change}>
      {profilePicture ? <img className='w-12 h-12 object-cover rounded-full' src={profilePicture} alt='profile'/> : <div className='w-12 h-12 bg-white rounded-full'></div>}
      <div className='pl-1 pr-1 flex flex-col'>
        <div className='text-lg font-semibold'>
          {name}
        </div>
        <div className='text-sm'>
          {latestMessage}
        </div>
      </div>
    </button>
  )
}

export default Contact