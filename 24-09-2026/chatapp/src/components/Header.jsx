import React, { useEffect, useState } from "react";
import { ChatList } from "./Sidebar/data";
import { useSelector } from "react-redux";

const Header = () => {

    const activeChatId = useSelector(
        (state)=>state.chat.activeChatId
    )
    
      const activeChat = ChatList.find(
        (chat) => chat.chatId === activeChatId
    );

   console.log("Active Chat:",activeChat)

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-5">
      <h1 className="text-lg font-semibold text-tertiary">
        {activeChat ? activeChat.name : "Chat App"}
      </h1>
    </header>
  );
};

export default Header;