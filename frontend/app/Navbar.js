"use client";

import axios from "axios";
import { useAppDispatch, useAppSelector } from "./lib/hooks";
import { setUserInfo } from "./lib/features/userSlice";
import { useEffect } from "react";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { setLogout } from "./lib/features/auth";
import logo from "./images/index";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoggedIn, token, user } = useAppSelector((state) => ({
    token: state.auth.token,
    isLoggedIn: state.auth.isLoggedIn,
    user: state.user.user
  }));

  const userInfo = () => {
    axios
      .get("https://notnulldeploay.onrender.com/users", {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((result) => {
        dispatch(setUserInfo(result.data.result));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    userInfo();
  }, []);

  const logout = () => {
    dispatch(setLogout());
  };

  return (
    <>
      {token && (
        <nav className="bg-gray-500">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="absolute -inset-0.5"></span>
                  <span className="sr-only">Open main menu</span>

                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>

                  <svg
                    className="hidden h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://i.ibb.co/MR2tFCg/Logo.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <a
                      href="/home"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Home
                    </a>
                    <a
                      href="/dashboard"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300"
                      aria-current="page"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/about"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      About
                    </a>
                    {/* <a
                    href="/message"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Chat
                  </a> */}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="relative ml-3">
                  <div>
                    <button
                      type="button"
                      className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      {token ? (
                        <span
                          className="absolute -inset-1.5"
                          onClick={() => {
                            router.push("/userpage");
                          }}
                        ></span>
                      ) : (
                        <span
                          className="absolute -inset-1.5"
                          onClick={() => {
                            router.push("/login");
                          }}
                        ></span>
                      )}

                      <img
                        className="h-8 w-8 rounded-full"
                        src={
                          user.photo ||
                          "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt=""
                      />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                >
                  <IoMdLogOut className="h-8 w-8 rounded-full ml-4 text-white " />
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
