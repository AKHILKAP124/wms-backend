import Message from "../models/MessageModel.js";

function getCurrentISTTime() {
    const now = new Date();
  
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
  
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(now);
  
    const dateParts = {};
    parts.forEach(({ type, value }) => {
      dateParts[type] = value;
    });
  
    return `${dateParts.hour}:${dateParts.minute} ${dateParts.dayPeriod}`;
  }


const newMessage = async (req, res) => {
    const currentTime = getCurrentISTTime();

    try {
        const { sender, receiver, content } = req.body;

        if (!sender || !receiver || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const message = new Message({
            sender: sender,
            receiver: receiver,
            content: content,
            createdAt: currentTime
        })

        await message.save();
        res.status(200).json({ message: "Message sent",data: message });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getMessages = async (req, res) => {


    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Id required" });
        }
        const messages = await Message.find({receiver: projectId}).populate('sender').populate('receiver');
        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const clearProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Id required" });
        }
        await Message.deleteMany({ receiver: projectId });
        res.status(200).json({ message: "Messages cleared" });
    } catch (error) {
        console.error("Error clearing messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteAll = async (req, res) => {
    try {
        await Message.deleteMany({});
        res.status(200).json({ message: "All messages deleted" });
    } catch (error) {
        console.error("Error deleting all messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { newMessage, getMessages, clearProjectMessages, deleteAll };