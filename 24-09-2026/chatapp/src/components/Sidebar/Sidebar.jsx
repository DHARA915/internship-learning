

import React, { useState } from "react";
import { ChatList } from "./data";
import { useDispatch , useSelector } from "react-redux";
import { setActiveChatId } from "../../redux/Slices/chatSlice";


const getInitials = (name = "") =>
    name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const Sidebar = () => {
    const dispatch = useDispatch();

    const [activeChatId, setLocalActiveChatId] = useState(
        localStorage.getItem("activeChatId") || null
    );

    console.log("ChatId:", activeChatId);

    // for getting all messages....
    const message = useSelector((state)=>state.message.messages)

    console.log("From Sidebar messages",message)

    const onClick = (id) => {
        // Update React state
        setLocalActiveChatId(id);

        // Save to localStorage
        localStorage.setItem("activeChatId", id);

        // Update Redux
        dispatch(setActiveChatId(id));
    };

    return (
        <aside className="flex h-full w-full max-w-xs flex-col border-r border-border bg-secondary">
            <div className="border-b border-border px-4 py-4">
                <h1 className="text-lg font-semibold text-tertiary">
                    Chats
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto">
                {ChatList.map((chat) => {
                    const isActive = chat.chatId === activeChatId;

                    const chatmessages=message.find((item)=>item.chatId===chat.chatId)
                    console.log("From Sidebar chat messages ...",chatmessages)
                    // for last message
                      const lastMessage =
        chatmessages?.messages[chatmessages.messages.length - 1];

        console.log("Last Message:",lastMessage)
                    return (
                        <button
                            key={chat.chatId}
                            onClick={() => onClick(chat.chatId)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-tertiary
                               
                            }`}
                        >
                            <div className="relative shrink-0">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary">
                                    {getInitials(chat.name)}
                                </div>

                                {chat.type === "group" && (
                                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] text-secondary ring-2 ring-secondary">
                                        👥
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-medium text-tertiary">
                                        {chat.name}
                                    </p>

                                    {chat.timestamp && (
                                        <span className="shrink-0 text-xs text-secondary">
                                            {lastMessage.timestamp}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-1 flex items-center justify-between gap-2">
                                    <p className="truncate text-sm text-secondary">
                                       {lastMessage?.text || ""}
                                    </p>

                                    {chat.unreadCount > 0 && (
                                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;