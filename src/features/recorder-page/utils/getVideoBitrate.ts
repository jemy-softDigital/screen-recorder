export const getVideoBitrate = (
  width: number = 1280,
  height: number = 720,
  fps: number = 30,
) => {
  return Math.floor(width * height * fps * 0.07);
};
