import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Providers from "./providers";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <Toaster visibleToasts={1} />
    </Providers>
  </StrictMode>,
);
