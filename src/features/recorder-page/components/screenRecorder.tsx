import React, { type RefObject } from "react";
import { Monitor } from "lucide-react";

interface ScreenRecorderProps {
  isIdle: boolean;
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  webcamEnabled: boolean;
  screenStream: MediaStream | null;
  webcamStream: MediaStream | null;
  recordedBlobUrl: string | null;
  screenPreviewRef: RefObject<HTMLVideoElement | null>;
  webcamPreviewRef: RefObject<HTMLVideoElement | null>;
  playbackRef: RefObject<HTMLVideoElement | null>;
}

const ScreenRecorder: React.FC<ScreenRecorderProps> = ({
  isIdle,
  isRecording,
  isPaused,
  isStopped,
  screenStream,
  webcamStream,
  recordedBlobUrl,
  screenPreviewRef,
  webcamPreviewRef,
  playbackRef,
  webcamEnabled,
}) => {
  return (
    <div className="flex-1 relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 min-h-100">
      {isIdle && !screenStream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Monitor className="w-12 h-12 text-white/30" />
          </div>
          <div className="text-center">
            <p className="text-white/50 text-lg">Ready to record your screen</p>
            <p className="text-white/30 text-sm mt-1">
              Configure your settings below and click Start Recording
            </p>
          </div>
        </div>
      )}
      {(isRecording || isPaused) && screenStream && (
        <video
          ref={screenPreviewRef}
          autoPlay
          muted
          playsInline
          className="w-full h-100 object-contain bg-black"
        />
      )}
      {isStopped && recordedBlobUrl && (
        <video
          ref={playbackRef}
          src={recordedBlobUrl}
          controls
          className="w-full h-100 object-contain bg-black"
        />
      )}
      {webcamEnabled && webcamStream && (isRecording || isPaused) && (
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
          <video
            ref={webcamPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover -scale-x-100"
          />
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
