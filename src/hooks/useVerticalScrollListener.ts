import { useEffect, useRef } from "react";

/**
 * React hook used to listen for vertical scroll events.
 *
 * Usage:
 *  ```
 *  const [ lastKnownScrollPosition ]= useVerticalScrollListener(root, threshold, crossedDownCallback, crossedUpCallback);
 *  ```
 *
 * @param {Document | Element} root=document - an element to which the listener will be attached to.
 * @param {number} threshold={} - A window.scrollY threshold value upon which the callbacks are fired
 * @param {(number) => void} crossedDownCallback - A callback which fires when the threshold is crossed by scrolling downwards
 * @param {(number) => void} crossedUpCallback - A callback which fires when the threshold is crossed by scrolling upwards
 * @returns {[number]} lastKnownScrollPosition - Last known scroll position
 */
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
