import { useEffect, useState } from "react";
import SelectFilter from "@/components/Fields/SelectFilter";
import { Mic2, Video } from "lucide-react";

interface MediaSelectorProps {
  isRecording: boolean;
  valueAudio: string;
  onChangeAudio: (value: string) => void;
  valueVideo: string;
  onChangeVideo: (value: string) => void;
}

const MediaSelector = ({
  isRecording,
  valueAudio,
  onChangeAudio,
  valueVideo,
  onChangeVideo,
}: MediaSelectorProps) => {
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = devices
          .filter((device) => device.kind === "audioinput")
          .map((device, index) => ({
            value: device.deviceId,
            label: device.label ?? `Microphone ${index + 1}`,
          }));
        setAudioDevices(audioInputs);

        if (audioInputs.length)
          onChangeAudio(
            audioInputs.find((dev) => dev.value === "default")?.value ?? "",
          );

        const videoInputs = devices
          .filter((device) => device.kind === "videoinput")
          .map((device, index) => ({
            value: device.deviceId,
            label: device.label ?? `Camera ${index + 1}`,
          }));
        setVideoDevices(videoInputs);

        if (videoInputs.length) onChangeVideo(videoInputs[0]?.value);
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };
    getDevices();
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    return () =>
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-4 flex-wrap max">
      <SelectFilter
        value={valueAudio}
        onValueChange={onChangeAudio}
        placeholder="Select microphone..."
        icon={Mic2}
        options={audioDevices}
        triggerClassName="bg-white text-black! font-medium  md:max-w-70 truncate"
        iconClassName="text-black"
        disabled={!audioDevices.length || isRecording}
        className="grow"
      />
      <SelectFilter
        value={valueVideo}
        onValueChange={onChangeVideo}
        icon={Video}
        placeholder="Select camera..."
        options={videoDevices}
        triggerClassName="bg-white text-black! font-medium  md:max-w-70 truncate"
        iconClassName="text-black"
        disabled={!videoDevices.length || isRecording}
        className="grow"
      />
    </div>
  );
};

export default MediaSelector;
