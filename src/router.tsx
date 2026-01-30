import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Recorder } from "./pages/recorder";
import NotFound from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/recorder",
    element: <Recorder />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
