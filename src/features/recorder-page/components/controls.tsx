import React from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Circle,
  Pause,
  Play,
  Square,
  Download,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export interface ControlsProps {
  micEnabled: boolean;
  systemAudioEnabled: boolean;
  webcamEnabled: boolean;
  loading: boolean;
  isIdle: boolean;
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  recordedBlobUrl: string | null;
  setMicEnabled: (value: boolean) => void;
  setSystemAudioEnabled: (value: boolean) => void;
  handleToggleWebcam: () => void;
  handleStartRecording: () => void;
  handlePauseRecording: () => void;
  handleResumeRecording: () => void;
  handleStopRecording: () => void;
  handleDownload: () => void;
  handleReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  micEnabled,
  systemAudioEnabled,
  webcamEnabled,
  isIdle,
  isRecording,
  isPaused,
  isStopped,
  loading,
  recordedBlobUrl,
  setMicEnabled,
  setSystemAudioEnabled,
  handleToggleWebcam,
  handleStartRecording,
  handlePauseRecording,
  handleResumeRecording,
  handleStopRecording,
  handleDownload,
  handleReset,
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={micEnabled ? "default" : "outline"}
            disabled={isRecording || isPaused}
            onClick={() => setMicEnabled(!micEnabled)}
            className={
              micEnabled
                ? "bg-white text-black hover:bg-white/90"
                : "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            }
          >
            {micEnabled ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Microphone</span>
          </Button>

          <Button
            variant={systemAudioEnabled ? "default" : "outline"}
            disabled={isRecording || isPaused}
            onClick={() => setSystemAudioEnabled(!systemAudioEnabled)}
            className={
              systemAudioEnabled
                ? "bg-white text-black hover:bg-white/90"
                : "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            }
          >
            {systemAudioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">System Audio</span>
          </Button>
          <Button
            variant={webcamEnabled ? "default" : "outline"}
            disabled={isRecording || isPaused}
            onClick={handleToggleWebcam}
            className={
              webcamEnabled
                ? "bg-white text-black hover:bg-white/90"
                : "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            }
          >
            {webcamEnabled ? (
              <Camera className="w-4 h-4" />
            ) : (
              <CameraOff className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Webcam</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {isIdle && (
            <Button
              onClick={handleStartRecording}
              className="bg-red-600 hover:bg-red-700 text-white  font-medium"
              isLoading={loading}
            >
              <Circle className="w-5 h-5 fill-current" />
              Start Recording
            </Button>
          )}
          {isRecording && (
            <Button
              onClick={handlePauseRecording}
              className="bg-yellow-600 hover:bg-yellow-700 text-white "
            >
              <Pause className="w-5 h-5" />
              Pause
            </Button>
          )}
          {isPaused && (
            <Button
              onClick={handleResumeRecording}
              className="bg-green-600 hover:bg-green-700 text-white px-6 "
            >
              <Play className="w-5 h-5" />
              Resume
            </Button>
          )}
          {(isRecording || isPaused) && (
            <Button
              onClick={handleStopRecording}
              className="bg-white text-black hover:bg-white/90 "
            >
              <Square className="w-5 h-5 fill-current" />
              Stop
            </Button>
          )}

          {isStopped && recordedBlobUrl && (
            <>
              <Button
                size="lg"
                onClick={handleDownload}
                className="bg-white text-black hover:bg-white/90   font-medium "
              >
                <Download className="w-5 h-5" />
                Download
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="bg-white text-black hover:bg-white/90   font-medium "
              >
                <RotateCcw className="w-5 h-5" />
                New Recording
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
