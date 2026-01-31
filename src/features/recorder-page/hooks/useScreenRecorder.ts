import { useState, useRef, useCallback, useEffect } from "react";
import { getVideoBitrate } from "../utils/getVideoBitrate";
import { getSupportedMimeType } from "../utils/getSupportedMimeType";
import { mixAudioTracks } from "../utils/mixAudioTracks";
import { createCompositeStream } from "../utils/createCompositeStream";

interface RecorderOptions {
  audioSource: AudioSource;
  captureWebcam: boolean;
  selectedAudioDevice: string;
  selectedVideoDevice: string;
}

interface ScreenRecorderState {
  status: RecordingStatus;
  error: string | null;
  loading: boolean;
  recordedBlobUrl: string | null;
  webcamStream: MediaStream | null;
  combinedStream: MediaStream | null;
}

interface ScreenRecorderActions {
  startRecording: (options: RecorderOptions) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  downloadRecording: (filename?: string) => void;
  resetRecorder: () => void;
  toggleWebcam: (enable: boolean) => Promise<void>;
}

export const useScreenRecorder = (): [
  ScreenRecorderState,
  ScreenRecorderActions,
] => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);

  const webcamStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const cleanupStreams = useCallback(() => {
    combinedStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    webcamStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    combinedStreamRef.current = null;
    micStreamRef.current = null;
    screenStreamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanupStreams();
      if (recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedBlobUrl]);

  const startRecording = useCallback(
    async (options: RecorderOptions): Promise<void> => {
      try {
        setLoading(true);
        const micSupport = ["both", "mic"].includes(options.audioSource);
        const systemAudioSupport = ["both", "system"].includes(
          options.audioSource,
        );
        const cameraSupport = options.captureWebcam;
        setError(null);
        recordedChunksRef.current = [];
        const audioTracks: MediaStreamTrack[] = [];
        if (recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
        setRecordedBlobUrl(null);

        const screen = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "monitor" },
          audio: systemAudioSupport,
        });

        if (systemAudioSupport && screen.getAudioTracks().length === 0) {
          setError("Please Enable System Audio Permission To Use System Audio");
          setLoading(false);
          return;
        }

        screenStreamRef.current = screen;
        const tracks: MediaStreamTrack[] = [];
        if (systemAudioSupport) audioTracks.push(...screen.getAudioTracks());

        if (micSupport || cameraSupport) {
          const userMedia = await navigator.mediaDevices.getUserMedia({
            audio: micSupport
              ? {
                  deviceId: { exact: options.selectedAudioDevice },
                }
              : false,
            video: cameraSupport
              ? {
                  deviceId: { exact: options.selectedVideoDevice },
                }
              : false,
          });
          micStreamRef.current = userMedia;
          webcamStreamRef.current = userMedia;
          if (micSupport) audioTracks.push(...userMedia.getAudioTracks());
        }

        const videoStream = createCompositeStream(
          screenStreamRef.current,
          webcamStreamRef.current ?? undefined,
        );

        tracks.push(...videoStream.getVideoTracks());

        const mixedAudioConfiguration = mixAudioTracks(audioTracks);
        if (mixedAudioConfiguration) tracks.push(mixedAudioConfiguration);

        const combinedStream = new MediaStream(tracks);
        combinedStreamRef.current = combinedStream;

        const mimeType = getSupportedMimeType();
        const { width, height, frameRate } = combinedStream
          .getVideoTracks()[0]
          .getSettings();

        const mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: getVideoBitrate(width, height, frameRate),
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0)
            recordedChunksRef.current.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setRecordedBlobUrl(url);
          setStatus("stopped");
        };

        mediaRecorder.onerror = () => {
          setError("Recording error occurred");
          setStatus("idle");
          cleanupStreams();
        };

        screen.getVideoTracks()[0].onended = () => {
          if (mediaRecorderRef.current?.state !== "inactive")
            mediaRecorderRef.current?.stop();
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setStatus("recording");
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        if (error.message === "Permission denied")
          setError("Please Check Permissions For Mic or Video");
        else setError(error.message);
        setStatus("idle");
        setLoading(false);
        cleanupStreams();
      }
    },
    [recordedBlobUrl, cleanupStreams],
  );

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setStatus("paused");
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setStatus("recording");
    }
  }, []);

  const downloadRecording = useCallback(
    (filename: string = "recording") => {
      if (!recordedBlobUrl) return;
      const a = document.createElement("a");
      a.href = recordedBlobUrl;
      a.download = `${filename}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    [recordedBlobUrl],
  );

  const resetRecorder = useCallback(() => {
    cleanupStreams();
    if (recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
    setRecordedBlobUrl(null);
    setStatus("idle");
    setError(null);
    recordedChunksRef.current = [];
  }, [cleanupStreams, recordedBlobUrl]);

  const toggleWebcam = useCallback(async (enable: boolean) => {
    if (enable && !webcamStreamRef.current) {
      try {
        const webcam = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        webcamStreamRef.current = webcam;
      } catch (err) {
        console.warn("Webcam access denied:", err);
        setError("Webcam access denied");
      }
    } else if (!enable && webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
  }, []);

  return [
    {
      status,
      error,
      recordedBlobUrl,
      loading,
      webcamStream: webcamStreamRef.current,
      combinedStream: combinedStreamRef.current,
    },
    {
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      downloadRecording,
      resetRecorder,
      toggleWebcam,
    },
  ];
};
