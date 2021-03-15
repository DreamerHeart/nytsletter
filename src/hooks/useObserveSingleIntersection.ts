import React, { useEffect, useRef } from "react";

type AfterIntersectionCallback = () => void;

/**
 * React hook used to listen for an event which is emitted upon the first intersection of the target element with the root element.
 * After the intersection the observer stops tracking the target element and can be reused to observe another one.
 *
 * Usage:
 *  ```
 *  const [ setObservedElement ] = useSingleIntersectionObserver(options, callback);
 *  ```
 *
 * @param {IntersectionObserverInit} options - root, rootMargin and threshold
 * @param {() => void} callback - A callback which fires upon intersection
 * @returns {[React.MutableRefObject<(newElement: Element | null | undefined) => void>]} setObservedElement - A method, used to set the new target element. Replaces the previously tracked element.
 */
const useSingleIntersectionObserver = function (
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  },
  callback: AfterIntersectionCallback
) {
  const elementRef: React.MutableRefObject<Element | null | undefined> = useRef(
    null
  );

  const intersectionObserverCallbackRef: React.MutableRefObject<IntersectionObserverCallback> = useRef(
    ([entry], observer) => {
      if (entry.isIntersecting && elementRef.current) {
        observer.unobserve(elementRef.current);
        elementRef.current = null;
        callback();
      }
    }
  );

  const observerRef: React.MutableRefObject<IntersectionObserver> = useRef<IntersectionObserver>(
    new IntersectionObserver(intersectionObserverCallbackRef.current, options)
  );

  const setObservedElement = useRef(
    (newElement: Element | null | undefined) => {
      if (elementRef.current) {
        observerRef?.current?.unobserve(elementRef.current);
      }

      elementRef.current = newElement;

      if (elementRef.current) {
        observerRef?.current?.observe(elementRef.current);
      }
    }
  );

  // Disconnect observer on unmount
  useEffect(() => {
    const currentObserver = observerRef.current;
    return () => {
      currentObserver.disconnect();
    };
  }, []);

  return [setObservedElement];
};

export default useSingleIntersectionObserver;
