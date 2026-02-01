import { useState } from "react";

export const useStopWatch = () => {
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [h, setH] = useState(0);

  //   start
  const start = () => {
    setSec(0);
    setMin(0);
    setH(0);
    setInterval(() => {
      setSec((prev) => {
        if (prev === 60) return 0;
        return prev + 1;
      });
    }, 1000)
    setInterval(() => {
      setMin((prev) => {
        if (prev === 60) return 0;
        return prev + 1;
      });
    }, 1000 * 60);
    setInterval(
      () => {
        setH((prev) => {
          return prev + 1;
        });
      },
      1000 * 60 * 60,
    );
  };

//   const reset = () => {};
  const pause = () => {

  };
};
