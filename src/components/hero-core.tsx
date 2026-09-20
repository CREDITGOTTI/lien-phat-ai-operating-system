import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, CircleDollarSign, Globe2, Layers3, MessageSquareText, Mic2, Send, Workflow } from "lucide-react";

type Mod = { name: string; Icon: typeof Mic2 };

const MODULES: Mod[] = [
  { name: "AI Voice", Icon: Mic2 },
  { name: "CRM", Icon: Layers3 },
  { name: "Automation", Icon: Workflow },
  { name: "Payments", Icon: CircleDollarSign },
  { name: "Calendar", Icon: CalendarDays },
  { name: "Conversation AI", Icon: MessageSquareText },
  { name: "Marketing", Icon: Send },
  { name: "Website", Icon: Globe2 },
];

type Offset = { x: number; y: number };
const ZERO: Offset = { x: 0, y: 0 };

/** Balanced orbit anchors: evenly spaced around the core, starting at the top. */
function anchor(i: number, radiusRatio: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / MODULES.length;
  return { ax: 0.5 + Math.cos(angle) * radiusRatio, ay: 0.5 + Math.sin(angle) * radiusRatio };
}

export function HeroCore() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [settling, setSettling] = useState<string | null>(null);
  const [activeName, setActiveName] = useState<string | null>(null);
  const dragRef = useRef<{ name: string; startX: number; startY: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize(el.clientWidth));
    ro.observe(el);
    setSize(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const radiusRatio = size && size < 480 ? 0.33 : 0.4;
  const coreRadius = Math.max(58, size * (size < 420 ? 0.15 : 0.155));
  const limit = Math.max(40, size * 0.16);

  const onPointerDown = useCallback((e: React.PointerEvent, name: string) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const cur = offsets[name] ?? ZERO;
    dragRef.current = { name, startX: e.clientX - cur.x, startY: e.clientY - cur.y };
    setDragging(name);
    setSettling(null);
    setActiveName(name);
  }, [offsets]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    e.preventDefault();
    const clamp = (v: number) => Math.max(-limit, Math.min(limit, v));
    const next = { x: clamp(e.clientX - d.startX), y: clamp(e.clientY - d.startY) };
    setOffsets((o) => ({ ...o, [d.name]: next }));
  }, [limit]);

  const endDrag = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    setDragging(null);
    setSettling(d.name);
    setOffsets((o) => ({ ...o, [d.name]: ZERO }));
    window.setTimeout(() => setSettling((s) => (s === d.name ? null : s)), 700);
  }, []);

  const center = size / 2;

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[580px] touch-none select-none" aria-label="Connected LIEN PHAT AI platform visualization">
      <svg aria-hidden="true" viewBox={`0 0 ${size || 600} ${size || 600}`} className="absolute inset-0 size-full">
        <circle cx={center} cy={center} r={size * 0.29} fill="none" stroke="var(--border)" />
        <circle cx={center} cy={center} r={size * 0.4} fill="none" stroke="var(--border)" opacity=".6" />
        {size > 0 && MODULES.map((m, i) => {
          const { ax, ay } = anchor(i, radiusRatio);
          const off = offsets[m.name] ?? ZERO;
          const nx = ax * size + off.x;
          const ny = ay * size + off.y;
          const dx = nx - center, dy = ny - center;
          const len = Math.hypot(dx, dy) || 1;
          const sx = center + (dx / len) * coreRadius;
          const sy = center + (dy / len) * coreRadius;
          const hot = activeName === m.name;
          return <line key={m.name} x1={sx} y1={sy} x2={nx} y2={ny} stroke="var(--primary)" strokeWidth={hot ? 1.8 : 1} strokeLinecap="round" opacity={hot ? 0.95 : 0.4} className="flow-line" />;
        })}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border border-primary/50 text-center transition-shadow duration-500"
        style={{
          width: coreRadius * 2,
          height: coreRadius * 2,
          background: "color-mix(in oklab, var(--warm, #f7f7f2) 96%, var(--primary) 4%)",
          boxShadow: `0 0 ${activeName ? 110 : 80}px color-mix(in oklab, var(--primary) ${activeName ? 48 : 32}%, transparent)`,
        }}
      >
        <img
          src="/lienphat-ai-core-approved.webp"
          alt="LIENPHAT AI CORE Systems Online"
          className="pointer-events-none size-[88%] object-contain"
        />
      </div>

      {MODULES.map((m, i) => {
        const { ax, ay } = anchor(i, radiusRatio);
        const off = offsets[m.name] ?? ZERO;
        const isDrag = dragging === m.name;
        const isSettling = settling === m.name;
        const hot = activeName === m.name;
        return (
          <button
            key={m.name}
            type="button"
            aria-label={`${m.name} module — draggable`}
            onPointerDown={(e) => onPointerDown(e, m.name)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onFocus={() => setActiveName(m.name)}
            onBlur={() => setActiveName((n) => (n === m.name ? null : n))}
            onMouseEnter={() => !dragRef.current && setActiveName(m.name)}
            onMouseLeave={() => !dragRef.current && setActiveName((n) => (n === m.name ? null : n))}
            className={`absolute z-10 flex items-center gap-2 rounded-md px-3 py-2 text-xs shadow-xl ${isDrag ? "cursor-grabbing" : "cursor-grab"} ${hot ? "border-primary/70 bg-surface-raised/90 text-foreground" : "glass"} ${isDrag ? "hero-node-drag" : isSettling ? "hero-node-snap" : "hero-node-idle"}`}
            style={{
              left: `${ax * 100}%`,
              top: `${ay * 100}%`,
              transform: `translate(calc(-50% + ${off.x}px), calc(-50% + ${off.y}px)) scale(${isDrag ? 1.07 : 1})`,
              animationDelay: `${i * -0.65}s`,
              boxShadow: hot ? "0 0 26px color-mix(in oklab, var(--primary) 34%, transparent)" : undefined,
              borderWidth: 1,
            }}
          >
            <span className={`flex items-center gap-2 ${isDrag || isSettling ? "" : "hero-float"}`}>
              <m.Icon className="size-4 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{m.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}