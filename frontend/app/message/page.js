"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { io } from "socket.io-client";
import { setMessage, createMessage } from "../lib/features/message";
import axios from "axios";

const Message = () => {
  const [to, setTo] = useState("");
  const [messageText, setMessageText] = useState("");
  const dispatch = useAppDispatch();
  const { auth, messages,personal } = useAppSelector((state) => ({
    messages: state.message.message,
    auth: state.auth,
    personal:state.user
  }));

  const handleFollowersId = (id) => {
    setTo(id);
  };

  const getFollowers = useCallback(() => {
    axios
      .get(`http://localhost:5000/followers`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      })
      .then((result) => {
        dispatch(setFollowers(result.data.result));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [auth.token, dispatch]);

  const getAllMessage = useCallback(
    (id) => {
      axios
        .get(`http://localhost:5000/messages/${id}`, {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        })
        .then((result) => {
          dispatch(setMessage(result.data.result));
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [auth.token, dispatch]
  );

  const personalPage = useCallback(() => {
    axios
      .get(`http://localhost:5000/users/${auth.userId}`)
      .then((result) => {
        dispatch(setUserInfo(result.data.result[0]));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [auth.userId, dispatch]);

  useEffect(() => {
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId,
        token: auth.token,
      },
    });

    personalPage();
    getFollowers();
    getAllMessage(auth.userId);

    const receiveMessage = (data) => {
      dispatch(setMessage((prev) => [...prev, data]));
      console.log(data);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
      socket.disconnect();
    };
  }, [auth.userId, auth.token, dispatch, getFollowers, getAllMessage, personalPage]);

  const createNewMessage = () => {
    const newMessage = {
      receiver_id: to,
      sender_id: auth.userId,
      messages: messageText,
    };

    axios
      .post(`http://localhost:5000/messages/${to}`, newMessage, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      })
      .then((result) => {
        dispatch(createMessage(result.data.result));
        dispatch(setMessage((prev) => [...prev, result.data.result[0]]));
        console.log("Message stored in the database:", result.data.result);
      })
      .catch((err) => {
        console.error("Error storing message:", err);
      });
  };

  const sendMessage = () => {
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId,
        token: auth.token,
      },
    });

    socket.emit("message", {
      receiver_id: to,
      sender_id: auth.userId,
      messages: messageText,
    });

    socket.disconnect();
  };

  return (
    <>
      <div></div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              {personal.photo ? (
                <img
                  src={personal.photo}
                  alt=""
                  className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              ) : (
                <img
                  src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?w=826&t=st=1708943431~exp=1708944031~hmac=8c7a5395dac4611b0f9b5e202be4b31eb2302075e072940832d61722b1d0fc49"
                  alt=""
                  className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              )}
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">
                  {personal.firstname} {personal.lastname}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            
          </div>
        </div>
        {messages.map((elem, i) => (
          <div key={i} className="chat-message">
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div></div>
              </div>
              <div>
                <div
                  className={
                    (elem.sender_id === auth.userId &&
                      elem.receiver_id === to) ||
                    (elem.sender_id === to && elem.receiver_id === auth.userId)
                      ? "order-2 sender-message"
                      : "order-1 receiver-message"
                  }
                >
                  <span
                    className={`px-4 py-2 rounded-lg inline-block ${
                      (elem.sender_id === auth.userId &&
                        elem.receiver_id === to) ||
                      (elem.sender_id === to &&
                        elem.receiver_id === auth.userId)
                        ? "bg-green-400 text-white"
                        : "bg-blue-400 text-black"
                    }`}
                  >
                    {elem.messages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <span className="absolute inset-y-0 flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  ></path>
                </svg>
              </button>
            </span>
            <input
              type="text"
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              onChange={(e) => setMessageText(e.target.value)}
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <button
                id="send"
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                onClick={() => {
                  createNewMessage();
                  sendMessage();
                }}
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
