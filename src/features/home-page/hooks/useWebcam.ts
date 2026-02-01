import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

export const useWebcam = (onError: () => void) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const firstInitRef = useRef(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCameraAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
        setError(null);
        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            setIsReady(false);
            if (!firstInitRef.current) {
              setError("Camera access lost");
              onError();
            }
          });
        });
      }
    } catch (err) {
      const error = err as Error;
      setIsReady(false);
      if (!firstInitRef.current) {
        setError(error.message);
        onError();
        toast.error(error.message);
      }
    } finally {
      firstInitRef.current = false;
    }
  }, [onError]);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        t.stop();
      });
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  useEffect(() => {
    requestAnimationFrame(requestCameraAccess);
    return () => cleanup();
  }, [requestCameraAccess, cleanup]);

  return { videoRef, isReady, error, requestCameraAccess };
};
