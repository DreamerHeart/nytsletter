import { useEffect, useRef } from "react";

export const useVerticalScrollListener = (
  root: Document | Element = document,
  threshold: number,
  crossedDownCallback: (position: number) => void,
  crossedUpCallback: (position: number) => void
) => {
  const lastKnownScrollPosition = useRef(0);
  const ticking = useRef(false);
  useEffect(() => {
    const listener: EventListenerOrEventListenerObject = function (e) {
      let crossedDown = false;
      let crossedUp = false;
      if (
        lastKnownScrollPosition.current < threshold &&
        window.scrollY >= threshold
      )
        crossedDown = true;
      if (
        lastKnownScrollPosition.current > threshold &&
        window.scrollY <= threshold
      )
        crossedUp = true;

      lastKnownScrollPosition.current = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(function () {
          if (crossedDown) crossedDownCallback(lastKnownScrollPosition.current);
          if (crossedUp) crossedUpCallback(lastKnownScrollPosition.current);
          ticking.current = false;
        });

        ticking.current = true;
      }
    };
    root.addEventListener("scroll", listener);
    return () => {
      root.removeEventListener("scroll", listener);
    };
  });
  return [lastKnownScrollPosition];
};
