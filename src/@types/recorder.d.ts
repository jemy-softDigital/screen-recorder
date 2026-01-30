type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

type AudioSource = "none" | "mic" | "system" | "both";

interface RecorderOptions {
  audioSource: AudioSource;
  captureWebcam: boolean;
}
