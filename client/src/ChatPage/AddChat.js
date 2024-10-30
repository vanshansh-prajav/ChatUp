import React, { useContext, useState } from 'react'
import Button from '../Utilities/Button'
import { userData } from '../Home';

const AddChat = ({ updateContacts }) => {
  const user = useContext(userData);
  const [searchmail, setSearchMail] = useState("");
  const searchAndAdd = async () => {
    try {
      const response = await fetch("http://localhost:3001/finduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchMail: searchmail, userId: user.id }),
      });
      const res = await response.json();
      updateContacts();
      alert(res);
    }
    catch (e) {
      alert(`Error: ${e}`);
    }
  }
  return (
    <div className='flex lg:flex-row sm:flex-col justify-center items-center h-full'>
      <input placeholder='Enter Email' type='email' className='text-lg p-1 pl-2 pr-2 w-[40%] sm:w-[60%]' onChange={(e) => setSearchMail(e.target.value)}/>
      <Button type="button" click={searchAndAdd} data="Search & Add" newStyle="p-1.5 pl-2 pr-2 w-[120%] sm:w-[110%] bg-slate-500 hover:bg-gray-600 hover:text-white" />
    </div>
  )
}

export default AddChat