import { ArrowBigRight } from "lucide-react";
import { Link } from "react-router";
import WebcamPixelGrid from "./WebcamPixelGrid";

export const Hero = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <WebcamPixelGrid />
      </div>
      <div className="relative z-10 flex h-screen flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <div className="mb-6 w-fit mx-auto rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            Launch Your Screen Recording
          </div>

          <h1 className="mb-6 text-xl font-bold tracking-tight text-white sm:text-6xl">
            Record, Share, and Collaborate Effortlessly
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-white/60 sm:text-xl">
            Capture your screen with ease. Create tutorials, demos, or
            presentations and share them instantly—all from your browser.
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              to={"/recorder"}
              className="relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-medium text-black transition-all hover:bg-white/90 hover:scale-105"
            >
              Start Recording
              <ArrowBigRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
