import { useRef, useEffect, useCallback, useMemo } from "react";

interface UsePixelGridProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  gridCols: number;
  gridRows: number;
  maxElevation: number;
  motionSensitivity: number;
  elevationSmoothing: number;
  backgroundColor: string;
  mirror: boolean;
  gapRatio: number;
  invertColors: boolean;
  darken: number;
  borderColor: string;
  borderOpacity: number;
  isReady: boolean;
}

export const usePixelGrid = ({
  videoRef,
  gridCols,
  gridRows,
  maxElevation,
  motionSensitivity,
  elevationSmoothing,
  backgroundColor,
  mirror,
  gapRatio,
  invertColors,
  darken,
  borderColor,
  borderOpacity,
  isReady,
}: UsePixelGridProps) => {
  const processingCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const pixelDataRef = useRef<PixelData[][]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const borderRGB = useMemo(() => {
    const hex = borderColor.replace("#", "");
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }, [borderColor]);

  const setAllPixelsToColor = useCallback(
    (r: number, g: number, b: number) => {
      const pixels = pixelDataRef.current;
      timeRef.current += 0.02;
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const pixel = pixels[row][col];

          const wave =
            Math.sin(timeRef.current + row * 0.3 + col * 0.2) * 0.5 + 0.5;

          pixel.motion = wave * 0.6;
          pixel.targetElevation = wave * maxElevation * 0.6;
          pixel.currentElevation +=
            (pixel.targetElevation - pixel.currentElevation) *
            elevationSmoothing;

          pixel.r = r;
          pixel.g = g;
          pixel.b = b;
        }
      }
    },
    [gridCols, gridRows, elevationSmoothing, maxElevation],
  );

  useEffect(() => {
    pixelDataRef.current = Array.from({ length: gridRows }, () =>
      Array.from({ length: gridCols }, () => ({
        r: 0,
        g: 0,
        b: 0,
        motion: 0,
        targetElevation: 0,
        currentElevation: 0,
      })),
    );
  }, [gridCols, gridRows]);

  const render = useCallback(
    function renderLoop() {
      const video = videoRef.current;
      const processingCanvas = processingCanvasRef.current;
      const displayCanvas = displayCanvasRef.current;

      if (!processingCanvas || !displayCanvas) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const dispCtx = displayCanvas.getContext("2d");
      if (!dispCtx) {
        animationRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = displayCanvas.clientWidth;
      const height = displayCanvas.clientHeight;

      displayCanvas.width = width * dpr;
      displayCanvas.height = height * dpr;
      dispCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dispCtx.fillStyle = backgroundColor;
      dispCtx.fillRect(0, 0, width, height);

      const cellSize = Math.max(width / gridCols, height / gridRows);
      const gap = cellSize * gapRatio;
      const offsetX = (width - cellSize * gridCols) / 2;
      const offsetY = (height - cellSize * gridRows) / 2;

      const useVideo = video && video.readyState >= 2 && isReady;
      const pixels = pixelDataRef.current;

      if (useVideo && processingCanvas) {
        const procCtx = processingCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (procCtx) {
          processingCanvas.width = gridCols;
          processingCanvas.height = gridRows;
          procCtx.save();
          if (mirror) {
            procCtx.scale(-1, 1);
            procCtx.drawImage(video, -gridCols, 0, gridCols, gridRows);
          } else {
            procCtx.drawImage(video, 0, 0, gridCols, gridRows);
          }
          procCtx.restore();

          const imageData = procCtx.getImageData(0, 0, gridCols, gridRows).data;
          const prevData = previousFrameRef.current;

          for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
              const idx = (row * gridCols + col) * 4;
              let r = imageData[idx];
              let g = imageData[idx + 1];
              let b = imageData[idx + 2];

              const pixel = pixels[row][col];
              let motion = 0;

              if (prevData) {
                const diff =
                  Math.abs(r - prevData[idx]) +
                  Math.abs(g - prevData[idx + 1]) +
                  Math.abs(b - prevData[idx + 2]);
                motion = Math.min(1, diff / 255 / motionSensitivity);
              }

              pixel.motion = pixel.motion * 0.7 + motion * 0.3;

              if (invertColors) {
                r = 255 - r;
                g = 255 - g;
                b = 255 - b;
              }

              if (darken > 0) {
                const f = 1 - darken;
                r *= f;
                g *= f;
                b *= f;
              }

              pixel.r = r;
              pixel.g = g;
              pixel.b = b;
              pixel.targetElevation = pixel.motion * maxElevation;
              pixel.currentElevation +=
                (pixel.targetElevation - pixel.currentElevation) *
                elevationSmoothing;
            }
          }

          previousFrameRef.current = new Uint8ClampedArray(imageData);
        }
      } else {
        setAllPixelsToColor(0, 0, 0);
      }

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const pixel = pixels[row][col];
          const elev = pixel.currentElevation;

          const x = offsetX + col * cellSize - elev * 1.2;
          const y = offsetY + row * cellSize - elev * 1.8;

          const brightness = 1 + elev * 0.05;

          dispCtx.fillStyle = `rgb(
          ${Math.min(255, pixel.r * brightness)},
          ${Math.min(255, pixel.g * brightness)},
          ${Math.min(255, pixel.b * brightness)}
        )`;

          dispCtx.fillRect(
            x + gap / 2,
            y + gap / 2,
            cellSize - gap,
            cellSize - gap,
          );

          dispCtx.strokeStyle = `rgba(
          ${borderRGB.r},
          ${borderRGB.g},
          ${borderRGB.b},
          ${borderOpacity + elev * 0.008}
        )`;

          dispCtx.lineWidth = 0.5;
          dispCtx.strokeRect(
            x + gap / 2,
            y + gap / 2,
            cellSize - gap,
            cellSize - gap,
          );
        }
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    },
    [
      videoRef,
      gridCols,
      gridRows,
      maxElevation,
      motionSensitivity,
      elevationSmoothing,
      backgroundColor,
      mirror,
      gapRatio,
      invertColors,
      darken,
      borderOpacity,
      borderRGB,
      isReady,
      setAllPixelsToColor,
    ],
  );

  const start = useCallback(() => {
    animationRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationRef.current);
  }, [render]);

  return { processingCanvasRef, displayCanvasRef, start };
};
