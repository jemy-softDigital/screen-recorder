import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

type ErrorPopupProps = {
  show: boolean;
  onClose: () => void;
  onRetry: () => void;
};

const ErrorPopup: React.FC<ErrorPopupProps> = ({ show, onClose, onRetry }) => {
  if (!show) return null;
  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="relative flex items-start gap-3 rounded-lg border border-white/10 bg-black/80 p-4 backdrop-blur-xl shadow-2xl max-w-sm">
        <Button onClick={onClose} className="absolute top-2 right-2 p-1 h-6 ">
          <X className="w-4 h-4" />
        </Button>
        <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-white/60" />
        </div>
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium text-white/90">
            Camera access needed
          </p>
          <p className="mt-1 text-xs text-white/50">
            Enable camera for the interactive background effect
          </p>
          <Button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" /> Enable Camera
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
