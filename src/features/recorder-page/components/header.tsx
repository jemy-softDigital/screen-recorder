import { Monitor } from "lucide-react";
import { Link } from "react-router";

type RecorderHeaderProps = {
  isRecording: boolean;
  isPaused: boolean;
  time: string;
};

const RecorderHeader = ({
  isRecording,
  isPaused,
  time,
}: RecorderHeaderProps) => {
  return (
    <header className="border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={"/"}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Screen Recorder
              </h1>
              <p className="text-sm text-white/50">
                Record your screen with audio
              </p>
            </div>
          </div>
        </Link>

        {(isRecording || isPaused) && (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div
              className={`w-3 h-3 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-yellow-500"
              }`}
            />
            <span className="font-mono text-lg font-medium tracking-wider">
              {time}
            </span>
            <span className="text-sm text-white/50 uppercase tracking-wide">
              {isPaused ? "Paused" : "Recording"}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default RecorderHeader;
