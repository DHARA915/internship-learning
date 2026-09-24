import { createSlice } from "@reduxjs/toolkit";
import { Messages } from "../../modules/Chatwindow/data";

const initialState = {
    messages: Messages,
}

const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

const messageSlice = createSlice({
    name: "message",
    initialState,

    reducers: {
        addMessages: (state, action) => {
            const { chatId, text } = action.payload;

            console.log("MessageSlice action",action)
            console.log("MessageSlice action payload",action.payload)

            const chat = state.messages.find((chat) => chat.chatId === chatId);

            if (!chat) return;

            chat.messages.push({
                id: `msg-${Date.now()}`,
                text,
                timestamp: getCurrentTime(),
                edited: false,
            });

            console.log("After addMessage",chat.messages)

        },

        editMessages: (state, action) => {
            const { chatId, messageId, text } = action.payload;

            const chat = state.messages.find((chat) => chat.chatId === chatId);
            if (!chat) return;

            const message = chat.messages.find((message) => message.id === messageId);

            if (!message) return;

            message.text = text;
            message.timestamp = getCurrentTime();
            message.edited = true;
        },

        deleteMessages: (state, action) => {
            const { chatId, messageId } = action.payload;

            const chat = state.messages.find((chat) => chat.chatId === chatId);

            if (!chat) return;

            chat.messages = chat.messages.filter((message) => message.id !== messageId)

        }
    }

})

export const {
    addMessages, editMessages, deleteMessages
} = messageSlice.actions

export default messageSlice.reducer