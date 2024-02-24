import { useLayoutEffect, useRef } from 'react';

const useViewportVisibility = (ref, onEnterViewport, onLeaveViewport) => {
  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onEnterViewport();
        } else {
          onLeaveViewport();
        }
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, onEnterViewport, onLeaveViewport]);
};

export default useViewportVisibility;