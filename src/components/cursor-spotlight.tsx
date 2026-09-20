import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "button, a, input, select, textarea, [role='button'], [role='link'], [draggable='true']";
const LIGHT_CLASS_SELECTOR =
  ".bg-warm, .bg-white, [data-cursor-surface='light']";

type Point = { x: number; y: number };

function parseRgb(color: string) {
  const values = color.match(/[\d.]+/g)?.map(Number);
  if (!values || values.length < 3) return null;
  const [r, g, b, a = 1] = values;
  if (r === undefined || g === undefined || b === undefined) return null;
  return { r, g, b, a };
}

function surfaceIsLight(element: Element | null) {
  let current = element instanceof HTMLElement ? element : null;

  while (current) {
    if (current.matches(LIGHT_CLASS_SELECTOR)) return true;
    const color = parseRgb(window.getComputedStyle(current).backgroundColor);
    if (color && color.a > 0.08) {
      const luminance =
        (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
      return luminance > 0.62;
    }
    current = current.parentElement;
  }

  return false;
}

export function CursorSpotlight() {
  const primaryRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const primary = primaryRef.current;
    const trail = trailRef.current;
    const pulse = pulseRef.current;
    if (!primary || !trail || !pulse) return;

    let target: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let current: Point = { ...target };
    let trailing: Point = { ...target };
    let frame = 0;
    let visible = false;
    let theme: "dark" | "light" = "dark";
    let pulseTimer = 0;

    const setPosition = (element: HTMLElement, point: Point) => {
      element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
    };

    const updateContext = (x: number, y: number) => {
      const underneath = document.elementFromPoint(x, y);
      const nextTheme = surfaceIsLight(underneath) ? "light" : "dark";
      if (nextTheme !== theme) {
        theme = nextTheme;
        primary.dataset["theme"] = theme;
        trail.dataset["theme"] = theme;
        pulse.dataset["theme"] = theme;
      }
      primary.dataset["interactive"] = underneath?.closest(INTERACTIVE_SELECTOR) ? "true" : "false";
      const dialogOpen = Boolean(document.querySelector("[role='dialog'][data-state='open']"));
      primary.dataset["modal"] = dialogOpen ? "true" : "false";
      trail.dataset["modal"] = dialogOpen ? "true" : "false";
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      trailing.x += (current.x - trailing.x) * 0.09;
      trailing.y += (current.y - trailing.y) * 0.09;
      setPosition(primary, current);
      setPosition(trail, trailing);
      frame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      target = { x: event.clientX, y: event.clientY };
      updateContext(event.clientX, event.clientY);
      if (!visible) {
        current = { ...target };
        trailing = { ...target };
        primary.dataset["visible"] = "true";
        trail.dataset["visible"] = "true";
        visible = true;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pulse.classList.remove("cursor-spotlight-pulse-active");
      setPosition(pulse, { x: event.clientX, y: event.clientY });
      void pulse.offsetWidth;
      pulse.classList.add("cursor-spotlight-pulse-active");
      window.clearTimeout(pulseTimer);
      pulseTimer = window.setTimeout(
        () => pulse.classList.remove("cursor-spotlight-pulse-active"),
        520,
      );
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      primary.dataset["visible"] = "false";
      trail.dataset["visible"] = "false";
      visible = false;
    };

    frame = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(pulseTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-spotlight-root">
      <div ref={trailRef} className="cursor-spotlight-trail" data-theme="dark" />
      <div ref={primaryRef} className="cursor-spotlight-primary" data-theme="dark" />
      <div ref={pulseRef} className="cursor-spotlight-pulse" data-theme="dark" />
    </div>
  );
}