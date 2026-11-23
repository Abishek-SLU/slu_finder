import { ComponentRef, useEffect, useRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

/** Ease desktop wheel input on the real scroll viewport, leaving touch native. */
export default function SmoothScrollView(props: ScrollViewProps) {
  const ref = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    const node: unknown = ref.current?.getScrollableNode();
    if (!(node instanceof HTMLElement)) return;
    const element = node;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previous = element.style.scrollBehavior;
    // Frame-by-frame scrolling must not start a second CSS smooth animation.
    element.style.scrollBehavior = "auto";
    let frame = 0;
    let target = element.scrollTop;
    let position = target;
    let lastTime = 0;
    const maximum = () => Math.max(0, element.scrollHeight - element.clientHeight);
    const clamp = (value: number) => Math.max(0, Math.min(maximum(), value));
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      target = element.scrollTop;
      position = target;
    }
    function step(time: number) {
      const elapsed = Math.min(64, time - lastTime);
      lastTime = time;
      target = clamp(target);
      const remaining = target - position;
      if (Math.abs(remaining) < 1) {
        element.scrollTop = target;
        frame = 0;
        return;
      }
      position += remaining * (1 - Math.exp(-elapsed / 105));
      element.scrollTop = position;
      frame = requestAnimationFrame(step);
    }
    function wheel(event: WheelEvent) {
      if (preference.matches || event.defaultPrevented || !event.cancelable || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // A textarea or another nested scroll region should handle its own wheel.
      for (const child of event.composedPath()) {
        if (child === element) break;
        if (child instanceof HTMLElement && child.scrollHeight > child.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(child).overflowY)) return;
      }
      if (maximum() <= 0) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
      if (!delta) return;
      if (!frame) { target = element.scrollTop; position = target; }
      const next = clamp(target + delta);
      if (next === target && !frame) return;
      event.preventDefault();
      target = next;
      if (!frame) {
        lastTime = performance.now();
        frame = requestAnimationFrame(step);
      }
    }
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("touchstart", stop, { passive: true });
    element.addEventListener("pointerdown", stop, { passive: true });
    element.addEventListener("keydown", stop);
    preference.addEventListener("change", stop);
    return () => {
      stop();
      element.style.scrollBehavior = previous;
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("touchstart", stop);
      element.removeEventListener("pointerdown", stop);
      element.removeEventListener("keydown", stop);
      preference.removeEventListener("change", stop);
    };
  }, []);
  return <ScrollView {...props} ref={ref} />;
}
