import React from "react";

const page = () => {
  return (
    <div class=" flex-col sm:flex items-center max-w-screen-3xl m-20 p-16  ">
      <div class="sm:w-1/2 p-10">
        <div class="image object-center text-center p-360">
          <img src="https://i.ibb.co/MR2tFCg/Logo.png" />
        </div>
      </div>
      <div class="sm:w-1/2 p-5">
        <div class="text">
          <h2 class="my-4 font-bold text-3xl  sm:text-4xl text-center">
            About <span class="text-indigo-600">Our Company</span>
          </h2>
          <p class="text-gray-900 text-center text-xl">
            Let's discover how you can create your case here and follow up on it
            with your team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
