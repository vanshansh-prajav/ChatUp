import React, { useEffect, useState, useMemo } from 'react'
import { useLocation } from "react-router-dom";
import NavBar from './ChatPage/NavBar';
import Contacts from './ChatPage/Contacts';
import ChatArea from './ChatPage/ChatArea';
import Settings from './ChatPage/Settings'
import AddChat from './ChatPage/AddChat'

export const userData = React.createContext();
export const activeContact = React.createContext();

const Home = () => {
  const user = useLocation().state;
  const [currentContact, setCurrentContact] = useState({});
  const [componentName, setComponentName] = useState("none");
  const [contacts, setContacts] = useState();
  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:3001/fetchcontacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: user.id })
      });
      const res = JSON.parse(await response.json());
      setContacts(res);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, [componentName])


  const activeContactValue = useMemo(() => ({ currentContact, setCurrentContact }), [currentContact, setCurrentContact]);

  const component = () => {
    switch (componentName) {
      case "chat": return <ChatArea name={currentContact.contactName} chatId={currentContact.chatId} profilePicture={currentContact.profilePicture} id={currentContact.recipientId}/>;
      case "add": return <AddChat updateContacts={fetchContacts} />;
      case "settings": return <Settings />;
      default: return <></>;
    }
  }

  return (
    <userData.Provider value={user}>
      <activeContact.Provider value={activeContactValue}>
        <div className="h-screen w-screen flex justify-center items-center bg-slate-700 max-w-[96%] max-h-[90%]">
          <div className='border-2 border-black lg:basis-[3%] md:basis-[5%] sm:basis-[6%] xs:basis[10%] h-full rounded-tl-2xl rounded-bl-2xl content-end bg-slate-600'>
            <NavBar setName={setComponentName} />
          </div>
          <div className='border-2 border-white lg:basis-[27%] md:basis-[35%] sm:basis-[35%] xs:basis[30%] h-full overflow-y-scroll'>
            <Contacts contacts={contacts} setName={setComponentName} />
          </div>
          <div className='border-2 border-black lg:basis-[70%] md:basis-[70%] sm:basis-[60%] xs:basis[60%] h-full rounded-tr-2xl rounded-br-2xl'>
            {component()}
          </div>
        </div>
      </activeContact.Provider>
    </userData.Provider>
  )
}

export default Home