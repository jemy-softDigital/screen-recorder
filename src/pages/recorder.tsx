import { useEffect, useRef, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { useScreenRecorder } from "@/features/recorder-page/hooks/useScreenRecorder";

import RecorderHeader from "@/features/recorder-page/components/header";
import { formatTime } from "@/features/recorder-page/utils/formatTime";
import Controls from "@/features/recorder-page/components/controls";
import ScreenRecorder from "@/features/recorder-page/components/screenRecorder";

export const Recorder = () => {
  const screenPreviewRef = useRef<HTMLVideoElement>(null);
  const webcamPreviewRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const [state, actions] = useScreenRecorder();
  const {
    status,
    error,
    recordedBlobUrl,
    webcamStream,
    combinedStream,
    loading,
  } = state;

  const [micEnabled, setMicEnabled] = useState(true);
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [selectedAudioDevice, setSelectedAudioDevice] =
    useState<string>("none");
  const [selectedVideoDevice, setSelectedVideoDevice] =
    useState<string>("none");

  const {
    seconds,
    minutes,
    hours,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useStopwatch({ autoStart: false });

  const getAudioSource = (): AudioSource => {
    if (micEnabled && systemAudioEnabled) return "both";
    if (micEnabled) return "mic";
    if (systemAudioEnabled) return "system";
    return "none";
  };

  useEffect(() => {
    if (screenPreviewRef.current && combinedStream)
      screenPreviewRef.current.srcObject = combinedStream;
  }, [combinedStream]);

  useEffect(() => {
    if (webcamPreviewRef.current && webcamStream)
      webcamPreviewRef.current.srcObject = webcamStream;
  }, [webcamStream]);

  const handleStartRecording = async () => {
    await actions.startRecording({
      audioSource: getAudioSource(),
      captureWebcam: webcamEnabled,
      selectedAudioDevice,
      selectedVideoDevice,
    });
    startTimer();
  };

  const handleStopRecording = () => {
    actions.stopRecording();
  };

  const handlePauseRecording = () => {
    actions.pauseRecording();
  };

  const handleResumeRecording = () => {
    actions.resumeRecording();
    startTimer();
  };

  useEffect(() => {
    if (status !== "recording") pauseTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleDownload = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    actions.downloadRecording(`screen-recording-${timestamp}`);
  };

  const handleReset = () => {
    actions.resetRecorder();
    resetTimer();
  };

  const handleToggleWebcam = async () => {
    const newState = !webcamEnabled;
    setWebcamEnabled(newState);
    if (status === "idle" || status === "stopped")
      await actions.toggleWebcam(newState);
  };

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isStopped = status === "stopped";
  const isIdle = status === "idle";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <RecorderHeader
        isRecording={isRecording}
        isPaused={isPaused}
        time={formatTime(hours, minutes, seconds)}
      />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
          <ScreenRecorder
            isIdle={isIdle}
            isRecording={isRecording}
            isPaused={isPaused}
            isStopped={isStopped}
            screenStream={combinedStream}
            webcamStream={webcamStream}
            recordedBlobUrl={recordedBlobUrl}
            screenPreviewRef={screenPreviewRef}
            webcamPreviewRef={webcamPreviewRef}
            playbackRef={playbackRef}
            webcamEnabled={webcamEnabled}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Controls
            micEnabled={micEnabled}
            setMicEnabled={setMicEnabled}
            systemAudioEnabled={systemAudioEnabled}
            setSystemAudioEnabled={setSystemAudioEnabled}
            webcamEnabled={webcamEnabled}
            handleToggleWebcam={handleToggleWebcam}
            handleStartRecording={handleStartRecording}
            handlePauseRecording={handlePauseRecording}
            handleResumeRecording={handleResumeRecording}
            handleStopRecording={handleStopRecording}
            handleDownload={handleDownload}
            handleReset={handleReset}
            isIdle={isIdle}
            isRecording={isRecording}
            isPaused={isPaused}
            isStopped={isStopped}
            recordedBlobUrl={recordedBlobUrl}
            loading={loading}
            selectedAudioDevice={selectedAudioDevice}
            setSelectedAudioDevice={setSelectedAudioDevice}
            selectedVideoDevice={selectedVideoDevice}
            setSelectedVideoDevice={setSelectedVideoDevice}
          />
        </div>
      </main>
    </div>
  );
};
