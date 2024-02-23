import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

const VideoChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [isCapturingFrames, setIsCapturingFrames] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    // Listen for the 'new_prediction' event
    socket.on('new_prediction', (prediction) => {
      console.log(prediction); // Log the prediction to the console
      // You can also set the prediction to state or perform other actions here
    });
  
    // Don't forget to clean up when the component unmounts
    return () => {
      socket.off('new_prediction');
    };
  }, []); 

  useEffect(() => {
    let frameCaptureInterval;

    const captureFrameFromFrontend = () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frameBase64 = canvas.toDataURL("image/jpeg", 0.8);
        console.log(frameBase64);
        // // On client
        // // const frameBase64 = // base64 frame

        // const bytes = atob(frameBase64);
        // const ab = new ArrayBuffer(bytes.length);
        // const ia = new Uint8Array(ab);
        // for (let i = 0; i < bytes.length; i++) {
        //   ia[i] = bytes.charCodeAt(i);
        // }

        // const blob = new Blob([ab], { type: 'image/jpeg' });

        socket.emit("capturedFrame", frameBase64);

        // Log a message indicating that a frame has been captured
        console.log("Frame captured from the frontend");

        // Emit the captured frame to the backend
        // socket.emit("capturedFrame", frameBase64);
      }
    };

    // Start capturing frames at a regular interval when isCapturingFrames is true
    if (isCapturingFrames) {
      frameCaptureInterval = setInterval(captureFrameFromFrontend, 1000); // Adjust frame rate as needed
    }

    return () => {
      // Clear the interval when the component is unmounted or isCapturingFrames becomes false
      clearInterval(frameCaptureInterval);
    };
  }, [isCapturingFrames]);

  const startVideoStream = () => {
    setIsCapturingFrames(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        // Send a message to the server to start processing video frames
        socket.emit("start_stream");

        const videoTracks = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTracks);

        const captureFrame = async () => {
          try {
            const imageBitmap = await imageCapture.grabFrame();

            const canvas = document.createElement("canvas");
            canvas.width = imageBitmap.width;
            canvas.height = imageBitmap.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(imageBitmap, 0, 0);

            // Convert canvas to base64 data URL
            const videoData = canvas.toDataURL("image/jpeg");

            // Send the video frame to the server
            socket.emit("video_stream", { frame: videoData });
            console.log(videoData);
            // Repeat the process for the next frame if streaming is still active
            if (isStreaming) {
              requestAnimationFrame(captureFrame);
            }
          } catch (error) {
            console.error("Error capturing frame:", error);
          }
        };

        // Start capturing frames
        setIsStreaming(true);
        captureFrame();
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  const stopVideoStream = () => {
    // Stop capturing frames
    setIsStreaming(false);
    setIsCapturingFrames(false);
    socket.emit("stopStream");

    // Stop the video stream and send a message to the server
    // to stop processing video frames
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;

    // Send a message to the server to stop processing video frames

    // setTimeout(() => {
    //   socket.disconnect();
    // }, 500);
  };

  return (
    <div>
      <div className="flex">
        <div className="w-2/3 pr-4 overflow-y-scroll">
          <div>
            <video
              className="h-3/4 w-3/4 rounded-lg"
              width="720"
              height="440"
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          </div>

          <div className="mt-4">
            <button onClick={isStreaming ? stopVideoStream : startVideoStream}>
              {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </button>
          </div>
        </div>
        <div className="w-1/3 pl-4">
          <h4>Prediction:</h4>

          <p>
            {predictions.map((prediction, index) => (
              <span key={index}>{prediction} </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;

//   useEffect(() => {
//     let frameCaptureInterval;

//     const captureFrameFromFrontend = () => {
//       if (videoRef.current) {
//         const canvas = document.createElement("canvas");
//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;
//         const context = canvas.getContext("2d");
//         context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//         const frameBase64 = canvas
//           .toDataURL("image/jpeg",0.8)
// console.log(frameBase64)
//         // // On client
//         // // const frameBase64 = // base64 frame

//         // const bytes = atob(frameBase64);
//         // const ab = new ArrayBuffer(bytes.length);
//         // const ia = new Uint8Array(ab);
//         // for (let i = 0; i < bytes.length; i++) {
//         //   ia[i] = bytes.charCodeAt(i);
//         // }

//         // const blob = new Blob([ab], { type: 'image/jpeg' });

//         socket.emit('capturedFrame', frameBase64);

//         // Log a message indicating that a frame has been captured
//         console.log("Frame captured from the frontend");

//         // Emit the captured frame to the backend
//         // socket.emit("capturedFrame", frameBase64);
//       }
//     };

//     // Start capturing frames at a regular interval when isCapturingFrames is true
//     if (isCapturingFrames) {
//       frameCaptureInterval = setInterval(captureFrameFromFrontend, 100); // Adjust frame rate as needed
//     }

//     return () => {
//       // Clear the interval when the component is unmounted or isCapturingFrames becomes false
//       clearInterval(frameCaptureInterval);
//     };
//   }, [isCapturingFrames]);

// useEffect(() => {
//   socket.on("predict", (resultValue) => {
//     setPredictions((prev) => [...prev, ...resultValue]);
//     console.log("Received result from the backend:", resultValue);
//   });

//   return () => {
//     socket.off("predict");
//   };
// }, []);

//   const startVideoStream = () => {
//     socket.emit("startStream");
//     setIsCapturingFrames(true);

//     const fileInput = document.getElementById('video-input');
//         const videoFile = fileInput.files[0];

//         const reader = new FileReader();

//         reader.onload = function (e) {
//             const videoData = e.target.result;
//             socket.emit('video_stream', { 'video': videoData });
//         };
// console.log(videoFile)
//         reader.readAsDataURL(videoFile);

//     // navigator.mediaDevices
//     //   .getUserMedia({ video: true, audio: true })
//     //   .then((stream) => {
//     //     videoRef.current.srcObject = stream;
//     //   })
//     //   .catch((error) => {
//     //     console.error("Error accessing camera:", error);
//     //   });
//     // setTimeout(() => {
//     //   socket.connect();
//     // }, 500);
//   };

//   const stopVideoStream = async () => {
//     socket.emit("stopStream");
//     setIsCapturingFrames(false);

//     try {
//       const tracks = videoRef.current.srcObject.getTracks();

//       tracks.forEach((track) => track.stop());
//     } catch (error) {
//       // handle error
//       console.log(error);
//     }
//     setTimeout(() => {
//       socket.disconnect();
//     }, 500);
//   };
