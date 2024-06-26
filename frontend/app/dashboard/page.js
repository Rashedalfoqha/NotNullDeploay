"use client";

import axios from "axios";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  createNewTicket,
  deleteTicket,
  setTickets,
  updateTicketById
} from "../lib/features/ticket";
import { storage } from "../firebase";
import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, token, ticket } = useAppSelector((state) => ({
    token: state.auth.token,
    isLoggedIn: state.auth.isLoggedIn,
    ticket: state.tickets.tickets
  }));

  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [drop, setDrop] = useState(false);
  const [file, setFile] = useState(null);

  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [time, setTime] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, `images/`);

  const uploadImage = () => {
    if (imageUpload === null) return;
    console.log(imageUpload);
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
        console.log("images upload");
      });
    });
  };

  const toggleDropdown = () => {
    setDrop(!drop);
  };
  const toggleDrawer = () => {
    setShow(!show);
  };

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
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

  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const createTicketFun = () => {
    axios
      .post(
        `http://localhost:5000/tickets/create`,
        {
          title,
          photo,
          cover,
          description,
          priority,
          end_at: time
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      .then((result) => {
        //console.log(result.data.result);
        dispatch(createNewTicket(result.data.result.rows));
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
      });
  };

  const updateTicketFun = (id) => {
    axios
      .put(
        `http://localhost:5000/tickets/update/${id}`,
        {
          title,
          photo,
          cover,
          description,
          priority,
          end_at: time
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      .then((result) => {
        //console.log(result);
        dispatch(updateTicketById(result.data.result.rows));
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
      });
  };

  const deleteTicketFun = (id) => {
    axios
      .delete(`http://localhost:5000/tickets/delete/${id}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((result) => {
        console.log(result);
        dispatch(deleteTicket(id));
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
      });
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-8 mx-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-gray-100">
                Your Tickets Here
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Should you track it
              </p>
            </div>

            <div className="overflow-hidden p-0.5 mt-6 border rounded-lg dark:border-gray-700">
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Create Ticket
              </button>

              {isOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <span
                      className="hidden sm:inline-block sm:align-middle sm:h-screen"
                      aria-hidden="true"
                    >
                      &#8203;
                    </span>

                    <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                      <div>
                        <div className="grid gap-6 mb-6 md:grid-cols-2"></div>
                        <div className="mb-6">
                          <label
                            htmlFor="text"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            id="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Title"
                            onChange={(e) => {
                              setTitle(e.target.value);
                            }}
                          />
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="text"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Description
                          </label>
                          <input
                            type="text"
                            id="description"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Description"
                            onChange={(e) => {
                              setDescription(e.target.value);
                            }}
                          />
                        </div>

                        <div className="mb-6">
                          <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file_input"
                          >
                            Upload photo
                          </label>
                          <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            aria-describedby="file_input_help"
                            id="file_input"
                            type="file"
                            onChange={(e) => {
                              setImageUpload(e.target.files[0]);
                            }}
                          />
                          <p
                            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                            id="file_input_help"
                          >
                            SVG, PNG, JPG or GIF (MAX. 800x400px).
                          </p>
                          <button onClick={uploadImage}>Upload</button>
                          {/* <div>Progress: {progress}%</div> */}
                          {/*  {imageUrl && <img src={imageUrl} alt="Uploaded" width="100" height="100" />} */}

                          <div className="mb-6">
                            <label
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              htmlFor="cover_input"
                            >
                              Upload cover
                            </label>
                            <input
                              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                              aria-describedby="cover_input_help"
                              id="cover_input"
                              type="file"
                              onChange={(e) => {
                                setCover(e.target.files[0]);
                              }}
                            />
                            <p
                              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                              id="cover_input_help"
                            >
                              SVG, PNG, JPG or GIF (MAX. 800x400px).
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="text"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Priority
                          </label>
                          <input
                            type="text"
                            id="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Priority"
                            onChange={(e) => {
                              setPriority(e.target.value);
                            }}
                          />
                        </div>

                        <div className="mb-6">
                          <label
                            htmlFor="time"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Deadline
                          </label>
                          <input
                            type="datetime-local"
                            id="time"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={handleChangeTime}
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6">
                        <button
                          onClick={() => {
                            createTicketFun();
                            setIsOpen(false);
                          }}
                          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border shadow-md dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          <button className="flex items-center gap-x-3 focus:outline-none">
                            <span>Ticket id</span>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          title
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          description
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          cover
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          priority
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          end at
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
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
                                  src={ticketItem.cover}
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
                                            Some helpful instruction goes over
                                            here.
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
                                            Some helpful instruction goes over
                                            here.
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
                                            Some helpful instruction goes over
                                            here.
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
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div
            class="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            role="alert"
          >
            <svg
              class="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">Dark alert!</span> Change a few things
              up and try submitting again.
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center mt-6 sm:flex sm:items-center sm:justify-between">
            {ticket.map((item) => (
              <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div class="flex flex-col items-center p-10">
                  <img
                    class="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={item.cover}
                    alt="Bonnie image"
                  />
                  <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </span>
                  <div class="flex mt-4 md:mt-6">
                    <a
                      href="#"
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={toggleDrawer}
                    >
                      UPDATE
                    </a>
                    <button
                      class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => deleteTicketFun(item.id)}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        id="UPDATE"
        className={`fixed top-0 left-0 z-40 w-96 h-screen p-4 overflow-y-auto transition-transform ${
          show ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-gray-800`}
      >
        <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          Update Ticket
        </h5>
        <button
          type="button"
          onClick={toggleDrawer}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        ></button>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="grid gap-6 mb-6 md:grid-cols-2"></div>
                <div className="mb-6">
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Title"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload photo
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="file_input"
                    type="file"
                    onChange={(e) => {
                      setImageUpload(e.target.files[0]);
                    }}
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    SVG, PNG, JPG or GIF (MAX. 800x400px).
                  </p>
                  <button onClick={uploadImage}>Upload</button>
                  {/* <div>Progress: {progress}%</div> */}
                  {/*  {imageUrl && <img src={imageUrl} alt="Uploaded" width="100" height="100" />} */}

                  <div className="mb-6">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="cover_input"
                    >
                      Upload cover
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      aria-describedby="cover_input_help"
                      id="cover_input"
                      type="file"
                      onChange={(e) => {
                        setCover(e.target.files[0]);
                      }}
                    />
                    <p
                      className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                      id="cover_input_help"
                    >
                      SVG, PNG, JPG or GIF (MAX. 800x400px).
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Priority
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Priority"
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="time"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleChangeTime}
                  />
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  onClick={() => {
                    updateTicketFun();
                    setShow(false);
                  }}
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="px-4 py-2 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
