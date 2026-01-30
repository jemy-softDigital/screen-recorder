import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useWebcam } from "../hooks/useWebcam";
import { usePixelGrid } from "../hooks/usePixelGrid";
import ErrorPopup from "./ErrorPopup";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gridOptions } from "../constants/gridOptions";

export const WebcamPixelGrid = () => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const { videoRef, isReady, error, requestCameraAccess } = useWebcam(() =>
    setShowErrorPopup(true),
  );

  const { processingCanvasRef, displayCanvasRef, start } = usePixelGrid({
    videoRef,
    isReady,
    ...gridOptions,
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div className={cn("relative w-full h-full")}>
      <video
        ref={videoRef}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        playsInline
        muted
      />

      <canvas
        ref={processingCanvasRef}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />

      <canvas ref={displayCanvasRef} className={cn("w-full h-full")} />

      <ErrorPopup
        show={showErrorPopup && !!error && !isReady}
        onClose={() => setShowErrorPopup(false)}
        onRetry={requestCameraAccess}
      />

      {error && !showErrorPopup && (
        <Button
          onClick={() => setShowErrorPopup(true)}
          className="fixed top-4 right-4 z-50 rounded-full"
          title="Camera access required"
        >
          <Camera className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default WebcamPixelGrid;
