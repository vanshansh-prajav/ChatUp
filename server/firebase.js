const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    doc,
    collection,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where
} = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyA5W4E4ArLjNbMMfkMeptVNSHM1Eec-AJ4",
    authDomain: "chatapp-5ac1e.firebaseapp.com",
    projectId: "chatapp-5ac1e",
    storageBucket: "chatapp-5ac1e.appspot.com",
    messagingSenderId: "1024462721116",
    appId: "1:1024462721116:web:8096ab9278913b30429699",
    measurementId: "G-T6C5BZBEXT"
};

let app;
let db;
let usersCollectionRef;
let usersChatCollectionRef;

const initializeFirebaseApp = () => {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        usersCollectionRef = collection(db, 'users');
        usersChatCollectionRef = collection(db, 'chats');
        if (!db || !usersCollectionRef || !usersChatCollectionRef) {
            throw new Error('Firestore is not initialized properly.');
        }
        return app;
    } catch (error) {
        return { message: error.message };
    }
};

const createUser = async ({ name, mobile, email, password, profilePicture }) => {
    try {
        const q = query(usersCollectionRef, where("mobile", "==", mobile));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            const userDocRef = await addDoc(usersCollectionRef, {});
            const data = {
                id: userDocRef.id,
                name: name,
                mobile: mobile,
                email: email,
                password: password,
                profilePicture: profilePicture
            };
            await setDoc(userDocRef, data);
            return { message: "User created successfully" };
        }
        throw new Error("User already exists");
    } catch (error) {
        return { message: error.message };
    }
};

const checkCredentials = async ({ email, password }) => {
    try {
        const q = query(usersCollectionRef, where("email", "==", email), where("password", "==", password));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let userData = querySnapshot.docs[0].data();
            return { message: "User authenticated successfully", user: userData };
        }
        throw new Error("User does'nt exist");
    } catch (error) {
        return { message: error.message };
    }
}

const findUser = async ({ searchMail, userId }) => {
    try {
        const q = query(usersCollectionRef, where("email", "==", searchMail));
        const querySnapshot = await getDocs(q);
        const userRef = doc(usersCollectionRef, userId);
        const userSnap = await getDoc(userRef);
        if (!querySnapshot.empty && !userSnap.empty) {
            let user1 = userSnap.data();
            let user2 = querySnapshot.docs[0].data();
            const chatExists = await haveChat({ user1, user2 });
            if (chatExists) {
                throw new Error("Chat already exists");
            }
            const usersChatDocRef = await addDoc(usersChatCollectionRef, {});
            const chatData = {
                chatId: usersChatDocRef.id,
                user1: user1,
                user2: user2
            }
            await setDoc(usersChatDocRef, chatData);
            return { message: "User added successfully" };
        }
        throw new Error("Error Occured");
    } catch (error) {
        console.log(error.message);
        return { message: error.message };
    }
}

const haveChat = async ({ user1, user2 }) => {
    const allDocsSnapshot = await getDocs(usersChatCollectionRef);
    let chatExists = false;

    if (!allDocsSnapshot.empty) {
        allDocsSnapshot.forEach((doc) => {
            const u1 = doc.data().user1;
            const u2 = doc.data().user2;
            if (u1.id === user1.id && u2.id === user2.id) {
                chatExists = true; 
            }
            if (u1.id === user2.id && u2.id === user1.id) {
                chatExists = true; 
            }
        });
    }

    return chatExists;
};
const getContacts = async ({ userId }) => {
    let contacts = [];
    try {
        // const queryUser1 = usersChatCollectionRef.where("user1.id", "==", userId);
        // const queryUser1Snapshot = await getDocs(queryUser1);
        // const queryUser2 = query(usersChatCollectionRef, where("user2.id", "==", userId));
        // const queryUser2Snapshot = await getDocs(queryUser2);

        // if (!queryUser1Snapshot.empty) {
        //     queryUser1Snapshot.forEach((doc) => {
        //         contacts.push(doc.data().user2);
        //     });
        // }
        // if (!queryUser2Snapshot.empty) {
        //     queryUser2Snapshot.forEach((doc) => {
        //         contacts.push(doc.data().user1);
        //     });
        // }

        const allDocsSnapshot = await getDocs(usersChatCollectionRef);
        allDocsSnapshot.forEach((doc) => {
            const chatId = doc.data().chatId
            const user1 = doc.data().user1;
            const user2 = doc.data().user2;
            let obj;
            if (user1.id === userId) {
                obj = {
                    user: user2,
                    chatId: chatId
                };
            }
            if (user2.id === userId) {
                obj = {
                    user: user1,
                    chatId: chatId
                };
            }
            if (obj)
                contacts.push(obj);
        });
        return { contacts, message: "Contacts fetched successfully" };
    } catch (error) {
        return { message: error.message };
    }
}

const addMessage = async (newMessage) => {
    try {
        const chatRef = doc(usersChatCollectionRef, newMessage.chatId);
        const messageCollection = collection(chatRef, "messages");

        const messageDocRef = await addDoc(messageCollection, {});
        const message = {
            messageId: messageDocRef.id,
            ownerId: newMessage.ownerId,
            message: newMessage.message,
            time: newMessage.time
        }
        await setDoc(messageDocRef, message);
        return { message: "Message added successfully" };
    } catch (error) {
        return { message: error.message };
    }
}

const getMessages = async ({ chatId }) => {
    let chat = [];
    try {
        const chatRef = doc(usersChatCollectionRef, chatId);
        const chatDocSnap = await getDoc(chatRef);
        if (!chatDocSnap.empty) {
            const messagesCollectionRef = collection(chatRef, "messages");
            const chatSnapShot = await getDocs(messagesCollectionRef);
            chatSnapShot.forEach(doc => {
                chat.push({ ...doc.data() });
            });
        }
        return { message: "Message fetch successfull", chats: chat };
    } catch (error) {
        return { message: error.message };
    }
}

const getFirebaseApp = () => app;

module.exports = {
    getFirebaseApp,
    initializeFirebaseApp,
    createUser,
    checkCredentials,
    findUser,
    getContacts,
    addMessage,
    getMessages
};
