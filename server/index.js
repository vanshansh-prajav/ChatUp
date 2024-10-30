const express = require("express");
const cors = require("cors");
const { getFirebaseApp, initializeFirebaseApp, createUser, checkCredentials, findUser, getContacts, addMessage, getMessages } = require("./firebase");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializeFirebaseApp();
const firebase = getFirebaseApp();

app.get("/", cors(), (req, res) => {
    res.send("Server is up and running");
});

app.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        let rv = await checkCredentials({ email, password });
        if(rv.message !== "User authenticated successfully")
            throw new Error(rv.message);
        res.json(JSON.stringify(rv));
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/signup", async (req, res) => {
    const { name, mobile, email, password, profilePicture } = req.body;
    try {
        let rv = await createUser({ name, mobile, email, password, profilePicture });
        res.json(rv.message);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/finduser", async (req, res) => {
    const { searchMail, userId } = req.body
    try {
        let rv = await findUser({ searchMail, userId });
        if(rv.message !== "User added successfully")
            throw new Error(rv.message);
        res.json(rv.message);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/fetchcontacts", async (req, res) => {
    const { userId }= req.body;
    try {
        let rv = await getContacts({ userId });
        if(rv.message !== "Contacts fetched successfully" && rv.message !== "No Contact to fetch")
            throw new Error(rv.message);
        res.json(JSON.stringify(rv.contacts));
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/sendmessage", async (req, res) => {
    const newMessage = req.body;
    try {
        let rv = await addMessage(newMessage);
        if(rv.message !== "Message added successfully")
            throw new Error(rv.message);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/getmessages", async (req, res) => {
    const { chatId } = req.body;
    try {
        let rv = await getMessages({ chatId });
        if(rv.message !== "Message fetch successfull")
            throw new Error(rv.message);
        res.json(JSON.stringify(rv.chats));
    } catch(error) {
        res.json(error.message);
    }
})

app.listen(3001, () => {
    console.log("Server Running");
});