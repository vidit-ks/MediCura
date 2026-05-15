import React, { useState } from "react";
import { BASE_URL } from "../config";
import icon01 from "../assets/images/icon01.png";

const Prediction = () => {
  const [prompt, setPrompt] = useState("");
  const [disease, setDisease] = useState({});
  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/ai/getprediction`,
        {
          method: "POST",
          body: JSON.stringify({
            prompt: prompt,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data = await response.json();
      console.log(data);
      setDisease(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row p-5 md:p-8 gap-8 md:justify-around items-start">
        <div className="flex justify-center md:block">
          <img src={icon01} className="w-[200px] h-[200px] md:w-[400px] md:h-[400px]" alt="" />
        </div>
        <div className="w-full md:max-w-[600px]">
          <h1 className="text-headingColor text-2xl">
            How are you feeling now?
          </h1>
          <div className="flex flex-col">
            <textarea
              className="p-3 lg:p-7 rounded-[12px] border border-solid border-[#D9DCE2] cursor-pointer mt-4 min-h-[200px] w-full"
              placeholder="Enter your problem here..."
              name="data"
              rows="3"
              columns="80"
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <button
              className="btn rounded-[50px] max-w-[250px] mx-auto"
              onClick={SubmitHandler}
            >
              Submit
            </button>
          </div>
          <div>
            <div className="p-4 rounded bg-[#fff9ea] mt-5">
              <span className="text-yellow-300 text-[15px] leading-6 font-semibold">
                Disease Name : {disease?.disease_name || "N/A"}
              </span>
              <p className="text-[16px] leading-6 font-medium text-textColor">
                Remedy : {disease?.basic_remedy || "N/A"}
              </p>
              <p className="text-[14px] leading-5 font-medium text-textColor">
                Self Curable : {disease?.self_curable || "N/A"}
              </p>
              <p className="text-[14px] leading-5 font-medium text-textColor">
                Doctor Type : {disease?.doctor_type || "N/A"}
              </p>
              <p className="text-[14px] leading-5 font-medium text-textColor">
                Other Symptoms : {disease?.other_symptoms || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
