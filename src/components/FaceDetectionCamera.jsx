import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

const FaceBox = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const detectFaces = async () => {
  if (videoRef.current) {
    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
    );

    const resized = faceapi.resizeResults(detections, {
      width: videoRef.current.width,
      height: videoRef.current.height,
    });

    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    faceapi.draw.drawDetections(canvasRef.current, resized);
  }

  requestAnimationFrame(detectFaces);
};


  useEffect(() => {
    const loadModel = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

      startVideo();
    };
    loadModel();

    const handlePlay = () => {
      const canvas = canvasRef.current;
      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        const resized = faceapi.resizeResults(detections, displaySize);
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resized);
      }, 100);
    };

    videoRef.current?.addEventListener("playing", handlePlay);
    detectFaces()

    return () => {
      videoRef.current?.removeEventListener("playing", handlePlay);
    };
  }, []);

  return (
    <div className="flex flex-col items-center relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ position: "absolute" }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: "absolute" }}
      />
    </div>
  );
};

export default FaceBox;
