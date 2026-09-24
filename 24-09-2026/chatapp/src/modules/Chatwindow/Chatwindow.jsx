
import React, { useState } from "react";
import { useSelector ,useDispatch } from "react-redux";
// import { Messages } from "./data";
import { addMessages ,editMessages,deleteMessages } from "../../redux/Slices/messageSlice";

const Chatwindow = () => {
    const [messageText, setMessageText] = useState("");

    const messages=useSelector((state)=>state.message.messages)

    const dispatch = useDispatch()

    // Get active chat ID from Redux
    const activeChatId = useSelector(
        (state) => state.chat.activeChatId
    );

    console.log("From chatWindow:", activeChatId )

    // Find the selected chat
    const activeChat = messages.find(
        (chat) => chat.chatId === activeChatId
    );

    console.log("Selected chat from chatWindow ", activeChat)

    // Get messages of selected chat
    const chatMessages = activeChat?.messages || [];


    const handleSubmit = ()=>{
        console.log("handle submit clicked")
       if(!messageText.trim()) return;

       dispatch(
        addMessages({
            chatId:activeChatId,
            text:messageText
        })
       )

       console.log("after dispatch ")
    }

    return (
        <div className="flex h-full flex-col bg-background">

            {/* Messages */}
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">

                {chatMessages.map((msg, index) => (
                    <div
                        key={msg.id}
                        className="flex justify-start"
                    >
                        <div
                            className="inline-block max-w-xs break-words rounded-lg rounded-bl-none bg-tertiary px-3 py-2 text-sm text-tertiary md:max-w-md"
                        >
                            <div>{msg.text}</div>

                            <div className="mt-1 text-xs opacity-60">
                                {msg.timestamp}
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {/* Input */}
            <div className="flex shrink-0 items-center gap-2 border-t border-border bg-secondary px-4 py-3">

                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 rounded-full bg-tertiary px-4 py-2 text-sm text-tertiary placeholder:text-secondary outline-none focus:ring-2 focus:ring-primary"
                />

                <button onClick={handleSubmit} className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary">
                    Send
                </button>

            </div>
        </div>
    );
};

export default Chatwindow;

