import { types } from "../constants/helpers";

export const getSupportedMimeType = (): string => {
  for (const type of types)
    if (MediaRecorder.isTypeSupported(type)) return type;
  return "video/webm";
};
