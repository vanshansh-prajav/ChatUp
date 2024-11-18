import React from 'react'
import Contact from '../Utilities/Contact'

const Contacts = ({ contacts, setName }) => {
  return (
    <>
      <p className='pt-2 pb-2 p-4 text-lg font-semibold bg-slate-600'>Chats</p>
      <div className='flex flex-col gap-1 p-2'>
        {(contacts && contacts.length > 0) ? (
          contacts.map((contact) => (
            <Contact key={contact.chatId} chatKey={contact.chatKey} profilePicture={contact.user.profilePicture} chatId={contact.chatId} id={contact.user.id} name={contact.user.name} setComponentName={() => setName("chat")} />
          ))
        ) : (
          <p>No contacts available</p>
        )}
      </div>
    </>
  )
}

export default Contacts