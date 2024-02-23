import React, { useState, useEffect, useRef } from "react";
import Slider from "react-input-slider";
import { SlSpeech } from "react-icons/sl";
import { FaMicrophone } from "react-icons/fa";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';

import xbot from "../../Models/xbot/xbot.glb";
import ybot from "../../Models/ybot/ybot.glb";
import xbotPic from "../../Models/xbot/xbot.png";
import ybotPic from "../../Models/ybot/ybot.png";

import * as words from "../../Animations/words";
import * as alphabets from "../../Animations/alphabets";
import { defaultPose } from "../../Animations/defaultPose";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const TextSign = () => {
  const [bot, setBot] = useState(ybot);
  const [speed, setSpeed] = useState(0.1);
  const [pause, setPause] = useState(200);
  const [text, setText] = useState("");
  const componentRef = useRef({});
  const { current: ref } = componentRef;

  useEffect(() => {
    // Check if the tour has already been run
    if (!localStorage.getItem("textToSignTourCompleted")) {
      const driverObj = driver({
        showProgress: true,
        popoverClass: "driverjs-theme",
        overlayColor: "gray",
        steps: [
          {
            element: "#text-to-sign",
            popover: {
              title: "Text to Sign",
              description:
                "Enter the text you want to convert to sign language here.",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#sign-to-text",
            popover: {
              title: "Sign to Text",
              description:
                "This section will convert sign language to text. (currently under development)",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#canvas",
            popover: {
              title: "Canvas",
              description: "This is where the sign language will be displayed.",
              side: "bottom",
              align: "start",
            },
          },
          {
            popover: {
              title: "End of Tour",
              description: "You have reached the end of the tour. Happy exploring!",
            },
          },
        ],
        onDestroyStarted: () => {
          if (!driverObj.hasNextStep()) {
            driverObj.destroy();
            // Set a flag in local storage to indicate the tour has been run
            localStorage.setItem("textToSignTourCompleted", "true");
          }
        },
      });
      driverObj.drive();
    }
  }, []);

  useEffect(() => {
    ref.flag = false;
    ref.pending = false;

    ref.animations = [];
    ref.characters = [];

    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xdddddd);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);

    ref.camera = new THREE.PerspectiveCamera(
      30,
      (window.innerWidth * 0.57) / (window.innerHeight - 70),
      0.1,
      1000
    );

    ref.renderer = new THREE.WebGLRenderer({ antialias: true });
    ref.renderer.setSize(window.innerWidth * 0.57, window.innerHeight - 70);
    document.getElementById("canvas").innerHTML = "";
    document.getElementById("canvas").appendChild(ref.renderer.domElement);

    ref.camera.position.z = 1.6;
    ref.camera.position.y = 1.4;

    let loader = new GLTFLoader();
    loader.load(
      bot,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.type === "SkinnedMesh") {
            child.frustumCulled = false;
          }
        });
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
        defaultPose(ref);
      },
      (xhr) => {
        console.log(xhr);
      }
    );
  }, [ref, bot]);

  ref.animate = () => {
    if (ref.animations.length === 0) {
      ref.pending = false;
      return;
    }
    requestAnimationFrame(ref.animate);
    if (ref.animations[0].length) {
      if (!ref.flag) {
        for (let i = 0; i < ref.animations[0].length; ) {
          let [boneName, action, axis, limit, sign] = ref.animations[0][i];
          if (
            sign === "+" &&
            ref.avatar.getObjectByName(boneName)[action][axis] < limit
          ) {
            ref.avatar.getObjectByName(boneName)[action][axis] += speed;
            ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(
              ref.avatar.getObjectByName(boneName)[action][axis],
              limit
            );
            i++;
          } else if (
            sign === "-" &&
            ref.avatar.getObjectByName(boneName)[action][axis] > limit
          ) {
            ref.avatar.getObjectByName(boneName)[action][axis] -= speed;
            ref.avatar.getObjectByName(boneName)[action][axis] = Math.max(
              ref.avatar.getObjectByName(boneName)[action][axis],
              limit
            );
            i++;
          } else {
            ref.animations[0].splice(i, 1);
          }
        }
      }
    } else {
      ref.flag = true;
      setTimeout(() => {
        ref.flag = false;
      }, pause);
      ref.animations.shift();
    }
    ref.renderer.render(ref.scene, ref.camera);
  };

  let alphaButtons = [];
  for (let i = 0; i < 26; i++) {
    alphaButtons.push(
      <div className="col-md-3">
        <button className="signs w-100 m-3 p-3">
          {String.fromCharCode(i + 65)}
        </button>
      </div>
    );
  }

  let wordButtons = [];
  for (let i = 0; i < words.wordList.length; i++) {
    wordButtons.push(
      <div className="col-md-4">
        <button
          className="signs w-100 m-3"
          onClick={() => {
            if (ref.animations.length === 0) {
              words[words.wordList[i]](ref);
            }
            console.log(words.wordList[i]);
          }}
        >
          {words.wordList[i]}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-16 ">
      <div className="flex flex-wrap justify-evenly">
        <div className="w-full md:w-1/4  flex flex-col justify-start">
          <div id="text-to-sign" className="m-8 ">
            <div className="flex items-center">
              <h1 className="text-xl font-bold mb-4 mx-2 flex items-center">
                Text to Sign
              </h1>
              <SlSpeech className="mb-4" />
            </div>

            <div className="flex flex-wrap">
              <textarea
                className="w-full p-3 border rounded text-gray-900"
                placeholder="Type text here..."
                value={text}
                onChange={(e) => {
                  console.log(e.target.value);
                  const text = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "");
                  setText(text);
                  const latestCharacter = text.charAt(text.length - 1); // Get the latest character
                  console.log(latestCharacter);
                  if (ref.animations.length === 0) {
                    alphabets[latestCharacter](ref);
                  }
                }}
              />
            </div>
          </div>
          <div id="sign-to-text" className="m-8">
            <div className="flex items-center">
              <h1 className="text-xl font-bold mb-4 mx-2 flex items-center">
                Speech to Sign
              </h1>
              <FaMicrophone className="mb-4" />
            </div>
            <div className="flex flex-wrap">
              <textarea
                disabled
                className="w-full p-3 border rounded text-gray-900"
                placeholder="Coming soon..."
                // value={text}
                onChange={(e) => {
                  console.log(e.target.value);
                  // const text = e.target.value
                  //   .toUpperCase()
                  //   .replace(/[^A-Z]/g, "");
                  // setText(text);
                  // const latestCharacter = text.charAt(text.length - 1); // Get the latest character
                  // console.log(latestCharacter);
                  // if (ref.animations.length === 0) {
                  //   alphabets[latestCharacter](ref);
                  // }
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4 rounded-xl overflow-auto">
          <div
            id="canvas"
            className="w-full rounded-3xl"
            style={{ aspectRatio: "16/9" }}
          />
        </div>

        {/* <div className='w-full md:w-1/6'>
      <p className='text-xl font-bold mb-4'>
        Select Avatar
      </p>
      <img src={xbotPic} className='bot-image w-11/12 mb-4' onClick={()=>{setBot(xbot)}} alt='Avatar 1: XBOT'/>
      <img src={ybotPic} className='bot-image w-11/12 mb-4' onClick={()=>{setBot(ybot)}} alt='Avatar 2: YBOT'/>
      <p className='text-lg'>
        Animation Speed: {Math.round(speed*100)/100}
      </p>
      <Slider
        axis="x"
        xmin={0.05}
        xmax={0.50}
        xstep={0.01}
        x={speed}
        onChange={({ x }) => setSpeed(x)}
        className='w-full mb-4'
      />
      <p className='text-lg'>
        Pause time: {pause} ms
      </p>
      <Slider
        axis="x"
        xmin={0}
        xmax={2000}
        xstep={100}
        x={pause}
        onChange={({ x }) => setPause(x)}
        className='w-full'
      />
    </div> */}
      </div>
    </div>
  );
};

export default TextSign;
