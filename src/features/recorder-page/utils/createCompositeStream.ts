export const createCompositeStream = (
  screenStream: MediaStream,
  webcamStream?: MediaStream,
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const screenVideo = document.createElement("video");
  screenVideo.srcObject = screenStream;
  screenVideo.muted = true;
  screenVideo.playsInline = true;
  screenVideo.play();

  let webcamVideo: HTMLVideoElement | null = null;
  if (webcamStream) {
    webcamVideo = document.createElement("video");
    webcamVideo.srcObject = webcamStream;
    webcamVideo.muted = true;
    webcamVideo.playsInline = true;
    webcamVideo.play();
  }

  const { width = 1280, height = 720 } = screenStream
    .getVideoTracks()[0]
    .getSettings();

  const MAX_WIDTH = 1280;
  const scale = Math.min(1, MAX_WIDTH / width);

  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  const draw = () => {
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

    if (webcamVideo && webcamVideo.videoWidth && webcamVideo.videoHeight) {
      const camSize = Math.floor(canvas.width * 0.22);
      const x = canvas.width - camSize - 16;
      const y = canvas.height - camSize - 16;

      const srcSize = Math.min(webcamVideo.videoWidth, webcamVideo.videoHeight);
      const sx = (webcamVideo.videoWidth - srcSize) / 2;
      const sy = (webcamVideo.videoHeight - srcSize) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, camSize, camSize, 14);
      ctx.clip();
      ctx.translate(x + camSize / 2, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(x + camSize / 2), 0);

      ctx.drawImage(
        webcamVideo,
        sx,
        sy,
        srcSize,
        srcSize,
        x,
        y,
        camSize,
        camSize,
      );

      ctx.restore();
    }

    setTimeout(draw, 33);
  };

  draw();

  return canvas.captureStream(30);
};
