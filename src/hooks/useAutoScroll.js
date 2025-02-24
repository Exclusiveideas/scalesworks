import { useEffect, useRef } from "react";

const useAutoScroll = (isStreaming) => {
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!isStreaming) return; // Only activate when streaming

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          elementRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      },
      { root: null, threshold: 0.1 } // Scroll when less than 10% visible
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isStreaming]); // Runs when `isStreaming` changes

  return elementRef;
};

export default useAutoScroll;
