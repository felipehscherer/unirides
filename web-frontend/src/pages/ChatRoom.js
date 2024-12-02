import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import './styles/Chat.css';

var stompClient = null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
        console.log(userData);

        const chatContainer = document.querySelector('.chat-messages');
        if (chatContainer) {
            const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
            if (isAtBottom) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }

        if (tab && privateChats.get(tab)) {
            const updatedPrivateChats = new Map(privateChats);
            const chatList = updatedPrivateChats.get(tab);

            chatList.forEach((msg) => {
                if (msg.read === false) {
                    msg.read = true;
                }
            });

            updatedPrivateChats.set(tab, chatList);
            setPrivateChats(updatedPrivateChats);

            sendReadStatus(tab); // Envia o status de leitura para o servidor
        }
    }, [userData, publicChats, privateChats, tab]);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        stompClient.subscribe('/user/' + userData.username + '/read-status', onReadStatusUpdate);
        userJoin();
    };

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    };

const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    const messageWithReadStatus = { ...payloadData, read: false }; // A mensagem é inicialmente "não lida"

    if (privateChats.get(payloadData.senderName)) {
        privateChats.get(payloadData.senderName).push(messageWithReadStatus);
        setPrivateChats(new Map(privateChats));
    } else {
        let list = [];
        list.push(messageWithReadStatus);
        privateChats.set(payloadData.senderName, list);
        setPrivateChats(new Map(privateChats));
    }

    // Envia o status de leitura ao servidor
    sendReadStatus(payloadData.senderName);
};

    const onError = (err) => {
        console.log(err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    };

    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    };

const sendPrivateValue = () => {
    if (stompClient && userData.message.trim() !== '') {
        var chatMessage = {
            senderName: userData.username,
            receiverName: tab, // O nome do destinatário para o chat privado
            message: userData.message,
            status: "MESSAGE"
        };
        if (userData.username !== tab) {
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" }); // Limpa a mensagem após enviar
    }
};

const sendReadStatus = (receiverName) => {
    const readStatusMessage = {
        senderName: userData.username,
        receiverName: receiverName,
        status: "READ"
    };
    stompClient.send("/app/read-status", {}, JSON.stringify(readStatusMessage));
};

const onReadStatusUpdate = (payload) => {
    const payloadData = JSON.parse(payload.body);

    setPrivateChats((prevChats) => {
        const updatedPrivateChats = new Map(prevChats);

        if (updatedPrivateChats.get(payloadData.senderName)) {
            const updatedChat = updatedPrivateChats.get(payloadData.senderName).map((msg) => {
                if (msg.senderName === payloadData.senderName && !msg.read) {
                    return { ...msg, read: true }; // Marca a mensagem como lida
                }
                return msg;
            });

            updatedPrivateChats.set(payloadData.senderName, updatedChat);
        }
        return updatedPrivateChats;
    });
};

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value });
    };

    const registerUser = () => {
        connect();
    };

const handleKeyDown = (event) => {
    // Verifica se a tecla pressionada é 'Enter' (código 13)
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão de envio (evita o submit de um formulário)

        // Verifica se há uma mensagem para enviar
        if (userData.message.trim() !== '') {
            if (tab === "CHATROOM") {
                sendValue(); // Envia a mensagem para o chat público
            } else {
                sendPrivateValue(); // Envia a mensagem para o chat privado
            }
        }
    }
};

const handleTabChange = (selectedTab) => {
    setTab(selectedTab);

    if (selectedTab !== "CHATROOM") {
        const updatedPrivateChats = new Map(privateChats);
        const chatList = updatedPrivateChats.get(selectedTab) || [];
        chatList.forEach((msg) => (msg.read = true));
        updatedPrivateChats.set(selectedTab, chatList);
        setPrivateChats(updatedPrivateChats);

        sendReadStatus(selectedTab); // Envia a confirmação de leitura
    }
};

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            {[...privateChats.keys()].map((name, index) => {
                                const unreadCount = privateChats.get(name).filter((msg) => !msg.read && msg.senderName !== userData.username).length;
                                return (
                                    <li onClick={() => handleTabChange(name)} className={`member ${tab === name && "active"}`} key={index}>
                                        {name} {unreadCount > 0 && <span className="unread-count">({unreadCount})</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>
                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="digite a mensagem" value={userData.message} onChange={handleMessage} onKeyDown={handleKeyDown} />
                            <button type="button" className="send-button" onClick={sendValue}>Enviar</button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                    <div className={`read-status ${chat.read ? 'read' : 'unread'}`}>
                                        {chat.read ? 'Lido' : 'Não Lido'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="digite a mensagem" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendPrivateValue}>Enviar</button>
                        </div>
                    </div>}
                </div> :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Digite seu nome"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        conectar
                    </button>
                </div>}
        </div>
    );
};

export default ChatRoom;
