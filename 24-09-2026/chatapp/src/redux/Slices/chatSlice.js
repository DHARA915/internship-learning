import { createSlice } from "@reduxjs/toolkit";
import { ChatList } from "../../components/Sidebar/data";

const initialState = {
    chats: ChatList,
    activeChatId: localStorage.getItem("activeChatId") || null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,

    reducers: {
        setActiveChatId: (state, action) => {
            state.activeChatId = action.payload;

            localStorage.setItem(
                "activeChatId",
                action.payload
            );
        },
    }
})

export const { setActiveChatId } = chatSlice.actions;

export default chatSlice.reducer