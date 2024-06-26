"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { useRouter } from "next/navigation";
import { setUserInfo } from "../lib/features/userSlice";
import { storage } from "../../app/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { setTickets } from "../lib/features/ticket";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const { token, user, userId, ticket } = useAppSelector((state) => ({
    token: state.auth.token,
    userId: state.auth.userId,
    user: state.user.user,
    ticket: state.tickets.tickets
  }));

  useEffect(() => {
    fetchUserInfo();
    fetchImageList();
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tickets/all`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((result) => {
        dispatch(setTickets(result.data.result.rows));
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
      });
  }, [dispatch, token]);
  const fetchUserInfo = () => {
    axios
      .get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        dispatch(setUserInfo(response.data.result));
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  };

  const updateUserData = (e) => {
    e.preventDefault();

    const isDataModified =
      username !== user.username ||
      imageUrl !== user.photo ||
      about !== user.about ||
      jobTitle !== user.job_title;

    if (isDataModified) {
      axios
        .put(
          "http://localhost:5000/users/update",
          {
            photo: imageUrl || user.photo,
            about: about || user.about,
            jobTitle: jobTitle || user.job_title,
            username: username || user.username
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          console.log("User data updated successfully:", response.data);
          closeModal();
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    } else {
      closeModal();
    }
  };

  const handleFileChangeImage = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const uploadImage = () => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `images/${imageUpload.name}_${uuidv4()}`);
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setImageUrl(url);
            console.log("Image uploaded successfully:", url);
          })
          .catch((error) => {
            console.error("Error fetching download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };
  const [show, setShow] = useState(false);
  const [drop, setDrop] = useState(false);
  const toggleDropdown = () => {
    setDrop(!drop);
  };
  const toggleDrawer = () => {
    setShow(!show);
  };

  const fetchImageList = () => {
    const imageListRef = ref(storage, `images/`);
    listAll(imageListRef)
      .then((response) => {
        const urlsPromises = response.items.map((itemRef) =>
          getDownloadURL(itemRef)
        );
        Promise.all(urlsPromises)
          .then((urls) => {
            setImageList(urls);
          })
          .catch((error) => {
            console.error("Error fetching image URLs:", error);
          });
      })
      .catch((error) => {
        console.error("Error listing images:", error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div class="bg-gray-100">
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start w-full h-full">
                    <form className="p-16" onSubmit={updateUserData}>
                      <div className="mb-6">
                        <label
                          htmlFor="title"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          FirstName
                        </label>
                        <input
                          type="text"
                          id="FirstName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="FirstName"
                          onChange={(e) => {
                            setFirstName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          LastName
                        </label>
                        <input
                          type="text"
                          id="LastName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="LastName ..."
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          country
                        </label>
                        <input
                          type="text"
                          id="country"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Description ..."
                          onChange={(e) => {
                            setCountry(e.target.value);
                          }}
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <label
                          htmlFor="dropzone-image"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              viewBox="0 0 20 16"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload user Photo
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            id="dropzone-image"
                            type="file"
                            className="hidden"
                            onChange={handleFileChangeImage}
                          />
                        </label>
                        {imageUpload && (
                          <button
                            onClick={uploadImage}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                          >
                            Upload Image
                          </button>
                        )}
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt="Uploaded Image"
                            className="mt-4 max-w-full"
                          />
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <label
                          htmlFor="dropzone-cover"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              viewBox="0 0 20 16"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload Cover User
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            id="dropzone-cover"
                            type="file"
                            className="hidden"
                            onChange={handleFileChangeImage}
                          />
                        </label>
                      </div>

                      <div className="flex items-start mb-6">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeTerms"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                          />
                        </div>
                        <label
                          htmlFor="agreeTerms"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          I agree with the{" "}
                          <a
                            href="#"
                            className="text-blue-600 hover:underline dark:text-blue-500"
                          >
                            update data
                          </a>
                          .
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div class="container mx-auto py-8">
          <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 sm:col-span-3">
              <div class="bg-white shadow rounded-lg p-6">
                <div class="flex flex-col items-center">
                  <img
                    src={
                      user.photo ||
                      "https://randomuser.me/api/portraits/men/94.jpg"
                    }
                    class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 class="text-xl font-bold">{user.username}</h1>
                  <p class="text-gray-700">{user.job_title}</p>
                  <div class="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                      href="#"
                      class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Contact
                    </a>
                    {userId == user.id && (
                      <button
                        onClick={() => {
                          openModal();
                        }}
                        className="py-3 px-4 inline-flex items-center   text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Update user information
                      </button>
                    )}
                  </div>
                </div>
                <hr class="my-6 border-t border-gray-300" />
              </div>
            </div>
            <div class="col-span-4 sm:col-span-9">
              <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-bold mb-4">About Me</h2>
                <p class="text-gray-700">{user.about}</p>

                <h3 class="font-semibold text-center mt-3 -mb-2">Find me on</h3>

                <h2 class="text-xl font-bold mt-6 mb-4">Ticket</h2>
                <div class="mb-6">
                  <div class="flex justify-between flex-wrap gap-2 w-full">
                    <p></p>
                  </div>
                  {ticket.map((ticketItem) => (
                    <tr key={ticketItem.title}>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                        <div>
                          <h2 className="font-medium text-gray-800 dark:text-white ">
                            {ticketItem.id}
                          </h2>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                          <h2 className="text-sm font-normal text-emerald-500">
                            {ticketItem.title}
                          </h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 dark:text-gray-200">
                            {ticketItem.description}
                          </h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <span className="text-gray-500 dark:text-gray-400">
                            <img
                              src={
                                ticketItem.cover ||
                                "https://i.ibb.co/MR2tFCg/Logo.png"
                              }
                              alt="cover"
                              className="w-10 h-10 rounded-full"
                            />
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 dark:text-gray-200">
                            {ticketItem.priority}
                          </h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 dark:text-gray-200">
                            {ticketItem.end_at}
                          </h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <button
                            id="dropdownHelperButton"
                            onClick={toggleDropdown}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                          >
                            state
                            <svg
                              className="w-2.5 h-2.5 ms-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 10 6"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 4 4 4-4"
                              />
                            </svg>
                          </button>

                          <div
                            id="dropdownHelper"
                            className={`z-10 ${
                              drop ? "block" : "hidden"
                            } bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600`}
                          >
                            <ul
                              className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="dropdownHelperButton"
                            >
                              <li>
                                <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="helper-checkbox-1"
                                      aria-describedby="helper-checkbox-text-1"
                                      type="checkbox"
                                      value=""
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                  </div>
                                  <div className="ms-2 text-sm">
                                    <label
                                      htmlFor="helper-checkbox-1"
                                      className="font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      <div>Enable notifications</div>
                                      <p
                                        id="helper-checkbox-text-1"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                      >
                                        Some helpful instruction goes over here.
                                      </p>
                                    </label>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="helper-checkbox-2"
                                      aria-describedby="helper-checkbox-text-2"
                                      type="checkbox"
                                      value=""
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                  </div>
                                  <div className="ms-2 text-sm">
                                    <label
                                      htmlFor="helper-checkbox-2"
                                      className="font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      <div>Enable 2FA auth</div>
                                      <p
                                        id="helper-checkbox-text-2"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                      >
                                        Some helpful instruction goes over here.
                                      </p>
                                    </label>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="helper-checkbox-3"
                                      aria-describedby="helper-checkbox-text-3"
                                      type="checkbox"
                                      value=""
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                  </div>
                                  <div className="ms-2 text-sm">
                                    <label
                                      htmlFor="helper-checkbox-3"
                                      className="font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      <div>Subscribe newsletter</div>
                                      <p
                                        id="helper-checkbox-text-3"
                                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                      >
                                        Some helpful instruction goes over here.
                                      </p>
                                    </label>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
