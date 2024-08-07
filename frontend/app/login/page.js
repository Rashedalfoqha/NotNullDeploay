"use client";
import axios from "axios";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setLogin, setUserId } from "../lib/features/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, token } = useAppSelector((state) => ({
    token: state.auth.token,
    isLoggedIn: state.auth.isLoggedIn
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLoginUser = (e) => {
    e.preventDefault();
    axios
      .post("https://notnulldeploay.onrender.com/users/login", {
        email,
        password
      })
      .then((result) => {
        console.log("Login successful:", result.data);
        dispatch(setUserId(result.data.userId));
        dispatch(setLogin(result.data.token));
        router.push("/home");
      })
      .catch((err) => {
        console.error(
          "Login failed:",
          err.response ? err.response.data : err.message
        );
      });
  };

  const handleGuestLogin = () => {
    const guestEmail = "guest@gmail.com"; 
    const guestPassword = "hashed_guest_password"; 
    axios
      .post("https://notnulldeploay.onrender.com/users/login", {
        email: guestEmail,
        password: guestPassword
      })
      .then((result) => {
        console.log("Guest login successful:", result.data);
        dispatch(setUserId(result.data.userId));
        dispatch(setLogin(result.data.token));
        router.push("/home");
      })
      .catch((err) => {
        console.error(
          "Guest login failed:",
          err.response ? err.response.data : err.message
        );
      });
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://i.ibb.co/MR2tFCg/Logo.png"
              alt="logo"
            />
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className=" p-6 space-y-4 md:space-y-6 sm:p-8">
              <button
                className="text-xl font-bold leading-tight  tracking-tight text-gray-900 md:text-2xl dark:text-white"
                aria-controls="login-form"
              >
                Login
              </button>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleLoginUser}
                id="login-form"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-zinc-950 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Guest Login
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
