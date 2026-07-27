import React from "react";

const HeroText = () => {
  return (
    <div className="flex justify-start items-center h-screen px-3 pl-4 md:pl-12">
      <div className="flex flex-col text-left max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
          Where Vision Meets Support
        </h1>
        <p className="text-base md:text-lg mb-5 text-gray-700 font-semibold">
          Behind every hackathon, workshop, and event, <br />
          there&apos;s a sponsor who made it happen.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300 mb-3 w-fit text-sm md:text-base">
          Become a Sponsor
        </button>
        <p className="text-xs md:text-sm text-gray-600 font-semibold">
          Partner with us to shape what comes next.
        </p>
      </div>
    </div>
  );
};

export default HeroText;