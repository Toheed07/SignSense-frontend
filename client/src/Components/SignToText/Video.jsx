import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// const apiUrl = "https://0ed6-103-248-209-227.ngrok-free.app"
// const apiUrl = "http://127.0.0.1:5000"
const socket = io("http://127.0.0.1:5000");
let intervalId;
let apiCallMade = false;

function CameraActivation() {
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [predictions, setPredictions] = useState("");
  const textAreaRef = useRef(null);
  const [text, setText] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Check if the tour has already been run
    if (!localStorage.getItem("signToTextTourCompleted")) {
      const driverObj = driver({
        showProgress: false,
        popoverClass: "driverjs-theme",
        overlayColor: "gray",
        steps: [
          {
            element: "#startCamera",
            popover: {
              title: "Start Camera",
              description: "Click here to start the camera.",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#stopCamera",
            popover: {
              title: "Stop Camera",
              description: "Click here to stop the camera.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#cameraStream",
            popover: {
              title: "Camera Stream",
              description: "This is where the camera feed is displayed.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#predictions",
            popover: {
              title: "Predictions",
              description:
                "Here you can see the predictions made based on the camera feed.",
              side: "left",
              align: "start",
            },
          },
          {
            popover: {
              title: "End of Tour",
              description:
                "You have reached the end of the tour. Happy exploring!",
            },
          },
        ],
        onDestroyStarted: () => {
          if (!driverObj.hasNextStep()) {
            driverObj.destroy();
            // Set a flag in local storage to indicate the tour has been run
            localStorage.setItem("signToTextTourCompleted", "true");
          }
        },
      });
      driverObj.drive();
    }
  }, []);

  useEffect(() => {
    // Listen for the 'new_prediction' event
    socket.on("new_prediction", (prediction) => {
      console.log(prediction);
      setDisplayedText((prevText) => prevText + " " + prediction);
      // Set an interval to append the prediction to the text every second
      // const intervalId = setInterval(() => {
      //   setDisplayedText((prevText) => prevText + " " + prediction);
      //   console.log(text);
      // }, 3000);


      // Clear the interval when the component unmounts
      return () => {
        clearInterval(intervalId);
      };
    });

    // Don't forget to clean up when the component unmounts
    return () => {
      socket.off("new_prediction");
    };
  }, []);

  // useEffect(() => {
  //   const words = displayedText.split(" ");

  //   let index = 0;
  //   const intervalId = setInterval(() => {
  //     if (index < words.length) {
  //       setDisplayedText((prevText) => prevText + words[index] + " ");
  //       index++;
  //     } else {
  //       clearInterval(intervalId);
  //     }
  //   }, 300);
  //   return () => clearInterval(intervalId);
  // }, [text]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const startCamera = async () => {
    const video = document.getElementById("cameraStream");
    fetch("http://127.0.0.1:5000/video_feed")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          // Reset video element and related variables again if needed
        }
      })
      .catch((error) => {
        console.log("Error stopping camera:", error);
      });
    try {
      const setupMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          video.srcObject = stream;
          await video.play();
        } catch (error) {
          console.log("Error accessing camera:", error);
        }
      };
      await setupMedia();
    } catch (error) {
      console.log("Error accessing camera:", error);
    }

    // Real Code to capture frames from frontend

    // try {
    //   const video = document.getElementById("cameraStream");
    //   const canvasOutput = document.createElement("canvas");
    //   const ctx = canvasOutput.getContext("2d");

    //   const setupMedia = async () => {
    //     try {
    //       const stream = await navigator.mediaDevices.getUserMedia({
    //         video: true,
    //       });
    //       video.srcObject = stream;
    //       await video.play();
    //     } catch (error) {
    //       console.log("Error accessing camera:", error);
    //     }
    //   };

    //   await setupMedia();
    //   console.log("Camera setup complete");

    //   const FPS = 60;
    //   video.width = 640;
    //   video.height = 480;
    //   intervalId = setInterval(() => {
    //     ctx.drawImage(video, 0, 0, video.width/2.66667, video.height/3.9999);
    //     console.log(video.videoHeight);
    //     console.log(video.videoWidth);
    //     const data = canvasOutput
    //       .toDataURL("image/jpeg")
    //       .replace("data:image/jpeg;base64,", "");
    //     socket.emit("image", data);
    //     console.log(data);
    //   }, 10000 / FPS);
    // } catch (error) {
    //   console.log("An error occurred:", error);
    // }
  };

  const stopCamera = () => {
    try {
      const video = document.getElementById("cameraStream");
      const stream = video.srcObject;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (video) {
        video.srcObject = null;
        setStream(null);
        setCameraActive(false);
        setPredictions("");
        socket.disconnect();
      }

      clearInterval(intervalId);

      fetch("http://127.0.0.1:5000/stop_camera")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Reset video element and related variables again if needed
            const video = document.getElementById("cameraStream");
            if (video) {
              const stream = video.srcObject;
              if (stream) {
                stream.getTracks().forEach((track) => track.stop());
              }
              video.srcObject = null;
              setStream(null);
              setCameraActive(false);
              setPredictions("");
              socket.disconnect();
            }
          }
        })
        .catch((error) => {
          console.log("Error stopping camera:", error);
        });
    } catch (error) {
      console.log("Error stopping camera:", error);
    }
  };

  return (
    <div className="flex flex-col   justify-evenly">
      {/* Button Section */}
      <div className="lg:w-1/3 flex justify-center lg:justify-start mb-4 lg:mb-0">
        <button
          id="startCamera"
          onClick={startCamera}
          type="button"
          className="text-gray-900 m-2 bg-gray-100 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-sm px-4 py-2 inline-flex items-center"
        >
          Start Camera
        </button>
        <button
          id="stopCamera"
          onClick={stopCamera}
          type="button"
          className="text-gray-900 bg-white m-2 hover:bg-gray-600 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 inline-flex items-center"
        >
          Stop Camera
        </button>
      </div>

      {/* Camera and Textbox Sections */}
      <div className="flex flex-col md:flex-row my-4 justify-center md:justify-start">
        {/* Camera Section */}
        <div className="md:w-2/3 order-2 md:order-1 rounded-lg overflow-hidden">
          <div className="w-full h-96 md:h-128 flex justify-center items-center rounded-xl ">
            <video
              id="cameraStream"
              className="h-full w-auto rounded-lg bg-gray-800"
              autoPlay
              playsInline
              muted
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>

        {/* Textbox Section */}
        <div className="md:w-1/3 order-1 md:order-2 rounded-lg">
          <div className="w-full h-48 md:h-96 flex justify-center items-center rounded-xl">
            <textarea
              id="predictions"
              ref={textAreaRef}
              className="animate-typing w-full h-full p-4 bg-gray-900 rounded-2xl resize-none border-0 focus:outline-none text-lg text-gray-200"
              value={displayedText}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraActivation;

{
  /* <div>
<div className="flex">
  <button
      onClick={startCamera}
      type="button"
      className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-sm px-5 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2"
  >
      Start Camera
  </button>
  <button
      onClick={stopCamera}
      type="button"
      className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-3.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
  >
      Stop Camera
  </button>
</div>

    <div>
      <div className="flex">
        <div className="w-2/3 pr-4">
          <div>
            <video
              id="cameraStream"
              className="h-3/4 w-3/4  rounded-lg"
              autoPlay
              playsInline
              muted
            />
          </div>
        </div>
        <div className="w-1/3 pl-4">
          <h4 className="font-bold text-3xl my-8">Prediction:</h4>
          {/* <h6 className="font-semibold text-xl py-12">{predictions}</h6> */
}
//         <textarea
//           ref={textAreaRef}
//           className="animate-typing w-full h-3/4 justify-end scroll-smooth p-4 bg-gray-900 rounded-2xl resize-none border-0 focus:outline-none text-2xl text-gray-200"
//           value={displayedText}
//           readOnly
//         />
//       </div>
//     </div>
//   </div>
// </div> */}
