import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { userData } from '../Home'
const Settings = () => {
  const user = useContext(userData);
  return (
    <div className='flex flex-col gap-10 justify-center items-center h-full'>
      {user.profilePicture ? <img src={user.profilePicture} alt='profile' /> : <div className='bg-white w-[150px] h-[150px] rounded-full'></div>}
      <div className='flex flex-col text-lg text-white font-light rounded-lg border p-4'>
        <p>
          Name: {user.name}
        </p>
        <p>
          Email: {user.email}
        </p>
        <p>
          Mobile Number: {user.mobile}
        </p>
      </div>
      <div className='flex items-end'>
        <div className='p-1 bg-red-300 rounded-lg pl-4 pr-4 hover:bg-red-500' ><Link to="/">Logout</Link></div>
      </div>
    </div>
  )
}

export default Settings