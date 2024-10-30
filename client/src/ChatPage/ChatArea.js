import React, { useContext, useEffect, useRef, useState } from 'react'
import Button from '../Utilities/Button'
import Message from '../Utilities/Message'

import { userData } from '../Home'

const ChatArea = ({ name, profilePicture, id, chatId }) => {
  const user = useContext(userData);
  const textInputRef = useRef();
  const lastMessageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const sendMessage = async () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const curentTime = `${hours}:${minutes}`;
    let newMessage = { message: message, ownerId: user.id, time: curentTime, chatId };
    setMessageList((prevList) => [...prevList, newMessage]);
    await fetch(`https://ppng.io/${user.id}-${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage)
    }).then(() => {
      textInputRef.current.value = "";
    });
    await fetch("http://localhost:3001/sendmessage", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage)
    });
  }
  // useEffect(() => {
  //   const receiveLoop = async () => {
  //     while (true) {
  //       try {
  //         const res = await fetch(`https://ppng.io/${id}-${user.id}`);
  //         let newMessage = await res.json();
  //         setMessageList((prevList) => [...prevList, newMessage]);
  //       } catch (error) {

  //       }
  //     }
  //   };
  //   receiveLoop();
  // }, [id, user.id]);
  useEffect(() => {
    const receiveLoop = async () => {
      let retryCount = 0;
      const maxRetries = 5; 

      while (true) {
        try {
          const res = await fetch(`https://ppng.io/${id}-${user.id}`);

          if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
          }

          const newMessage = await res.json();
          setMessageList((prevList) => [...prevList, newMessage]);

          retryCount = 0;

        } catch (error) {
          retryCount += 1;

          if (retryCount >= maxRetries) {
            console.error(`Stopping receiveLoop after ${maxRetries} failed attempts.`);
            break; 
          }

          console.error(`Attempt ${retryCount}: ${error.message}`);

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    receiveLoop();
  }, [id, user.id]);


  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:3001/getmessages", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId })
      });

      const chats = JSON.parse(await response.json());
      const processedChat = [];
      chats.forEach((chat) => {
        processedChat.push({ message: chat.message, ownerId: chat.ownerId, time: chat.time, chatId, id: chat.id })
      })
      setMessageList(processedChat);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  useEffect(() => {
    setMessageList([]);
  }, [name]);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex self-stretch content-end p-2 text-lg bg-slate-500 rounded-tr-xl text-3xl content-center gap-3'>
        {profilePicture ? <img className='w-16 h-16 object-cover rounded-full' src={profilePicture} alt='profilePicture' /> : <div className='bg-white w-16 h-16 rounded-full'></div>}
        <p className='self-center'>{name}</p>
      </div>
      <div className='flex flex-col p-1 border-8 border-r-0 border-slate-700 rounded-br-xl rounded-tr-xl h-full gap-4 overflow-y-scroll'>
        {messageList && messageList.length > 0 &&
          messageList.map((messageOne, index) => (
            <Message key={message.id ? message.id : Math.random()} message={messageOne.message} time={messageOne.time} owner={id === messageOne.ownerId} />
          ))
        }
        <hr ref={lastMessageRef} className='border-slate-500 self-end'></hr>
      </div>
      <div className='flex self-stretch content-end p-4 pt-1 text-lg'>
        <input ref={textInputRef} onKeyDown={(event) => {
          if (event.key === "Enter") {
            sendMessage();
          }
        }} placeholder='Send Message' className='w-full p-1 pl-2 pr-2 rounded-tl-lg rounded-bl-lg outline-none' onChange={(e) => setMessage(e.target.value)} />
        <Button type="button" data="send" click={sendMessage} newStyle="p-1 bg-emerald-600 rounded-tr-lg rounded-br-lg pl-4 pr-4 hover:bg-green-500" />
      </div>
    </div>
  )
}

export default ChatArea