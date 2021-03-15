import React, { useEffect, useRef } from "react";

type AfterIntersectionCallback = () => void;

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

  return [setObservedElement.current];
};

export default useSingleIntersectionObserver;
