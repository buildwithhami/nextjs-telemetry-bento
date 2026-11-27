"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import defaultData from "@/data/bento-data.json";

export type BentoIconName =
  | "stream"
  | "bolt"
  | "globe"
  | "chart"
  | "link"
  | "queue"
  | "store"
  | "audit";

export type BentoData = typeof defaultData;

export interface BentoGridProps {
  className?: string;
  data?: Partial<Pick<BentoData["cards"], "events" | "regions" | "beam" | "activity">>;
}

const ICONS: Record<BentoIconName, React.ReactNode> = {
  stream: (
    <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  ),
  bolt: <path d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />,
  globe: (
    <path d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  ),
  chart: (
    <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  ),
  link: (
    <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  ),
  queue: (
    <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
  ),
  store: (
    <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  ),
  audit: (
    <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  ),
};

function Icon({ name, strokeWidth = 1.75 }: { name: string; strokeWidth?: number }) {
  const path = ICONS[name as BentoIconName] ?? ICONS.bolt;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const uid = () => Math.random().toString(36).slice(2, 7);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const isReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTween(target: number, fmt: (v: number) => string, dur = 600) {
  const [text, setText] = useState(() => fmt(target));
  const valRef = useRef(target);
  const fmtRef = useRef(fmt);
  fmtRef.current = fmt;

  useEffect(() => {
    const from = valRef.current;
    if (from === target || isReduced()) {
      valRef.current = target;
      setText(fmtRef.current(target));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setText(fmtRef.current(from + (target - from) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else {
        valRef.current = target;
        setText(fmtRef.current(target));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);

  return text;
}

function CardShell({
  id,
  icon,
  title,
  desc,
  visibleRef,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  desc: string;
  visibleRef: React.MutableRefObject<boolean>;
  children: React.ReactNode;
}) {
  const [hot, setHot] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = articleRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibleRef]);

  return (
    <article
      ref={articleRef}
      className={`card ${id}${hot ? " is-hot" : ""}`}
      aria-labelledby={`${id}-t`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHot(true);
      }}
      onPointerLeave={() => setHot(false)}
      onPointerCancel={() => setHot(false)}
    >
      <header className="card-head">
        <span className="icon">
          <Icon name={icon} />
        </span>
        <div>
          <h3 className="title" id={`${id}-t`}>{title}</h3>
          <p className="desc">{desc}</p>
        </div>
      </header>
      <div className="panel">{children}</div>
    </article>
  );
}

const INITIAL_OFFSETS = [34, 27, 19, 11, 4];

/* 01 · Event pipeline (c1) */
function EventsCard({ cfg }: { cfg: BentoData["cards"]["events"] }) {
  const visibleRef = useRef(true);
  const [filter, setFilter] = useState<"all" | "webhook" | "error">("all");
  const templatesRef = useRef(cfg.templates);
  templatesRef.current = cfg.templates;

  const [events, setEvents] = useState(() =>
    INITIAL_OFFSETS.map((_, i) => {
      const tpl = cfg.templates[i % cfg.templates.length];
      return {
        id: `init-${i}`,
        type: tpl.type,
        status: tpl.status,
        time: "--:--:--",
        payload: tpl.payload.replace("%", "init"),
        animate: false,
      };
    })
  );

  useEffect(() => {
    setEvents((prev) =>
      prev.map((ev, i) => {
        const tpl = templatesRef.current[i % templatesRef.current.length];
        const sec = INITIAL_OFFSETS[i] ?? 0;
        return {
          ...ev,
          time: clock(new Date(Date.now() - sec * 1000)),
          payload: tpl.payload.replace("%", uid()),
        };
      })
    );
  }, []);

  const push = (tpl = pick(templatesRef.current), animate = true) => {
    if (!tpl) return;
    setEvents((prev) => [
      {
        id: `${Date.now()}-${uid()}`,
        type: tpl.type,
        status: tpl.status,
        time: clock(new Date()),
        payload: tpl.payload.replace("%", uid()),
        animate: animate && !isReduced(),
      },
      ...prev.slice(0, 29),
    ]);
  };

  useEffect(() => {
    if (isReduced()) return;
    const id = window.setInterval(() => {
      if (visibleRef.current && !document.hidden) push();
    }, cfg.intervalMs);
    return () => window.clearInterval(id);
  }, [cfg.intervalMs]);

  const rows = events.filter((e) => filter === "all" || e.type === filter).slice(0, 7);
  const pillFor = (s: number) => (s >= 400 ? "err" : s === 202 ? "warn" : "ok");

  return (
    <CardShell id="c1" icon={cfg.icon} title={cfg.title} desc={cfg.desc} visibleRef={visibleRef}>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Filter events">
          {(["all", "webhook", "error"] as const).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "webhook" ? "Webhooks" : "Errors"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="pill live">
            <i />
            live
          </span>
          <button type="button" className="btn" onClick={() => push(cfg.testEvent, true)}>
            Trigger test event
          </button>
        </div>
      </div>
      <ul className="log" aria-live="polite">
        {rows.length === 0 ? (
          <li className="empty">No events match this filter yet.</li>
        ) : (
          rows.map((e) => (
            <li key={e.id} className={`ev${e.animate ? " in" : ""}`}>
              <span className="t">{e.time}</span>
              <span className="p">
                <b>{e.type}</b> {e.payload}
              </span>
              <span className={`pill ${pillFor(e.status)}`}>{e.status}</span>
            </li>
          ))
        )}
      </ul>
    </CardShell>
  );
}

/* 02 · Edge routing (c2) */
function RegionsCard({ cfg }: { cfg: BentoData["cards"]["regions"] }) {
  const visibleRef = useRef(true);
  const [regions, setRegions] = useState(() => cfg.items.map((r) => ({ ...r, ms: r.base })));
  const [activeId, setActiveId] = useState(cfg.defaultActiveId);
  const [down, setDown] = useState<string[]>([]);
  const fillRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const barW = (ms: number) => `${Math.max(18, Math.round(100 - ms * 1.7))}%`;

  const sweep = (id: string, targetWidth: string) => {
    const fl = fillRefs.current[id];
    if (!fl || typeof fl.animate !== "function") return;
    fl.getAnimations().forEach((a) => a.cancel());
    fl.animate([{ width: "0%" }, { width: targetWidth }], {
      duration: 380,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "none",
    });
  };

  useEffect(() => {
    if (isReduced()) return;
    const id = window.setInterval(() => {
      if (!visibleRef.current || document.hidden) return;
      setRegions((prev) =>
        prev.map((r) => ({
          ...r,
          ms: Math.max(r.base - 2, Math.min(r.base + 3, r.ms + pick([-1, 0, 1]))),
        }))
      );
    }, cfg.tickMs);
    return () => window.clearInterval(id);
  }, [cfg.tickMs]);

  const active = regions.find((r) => r.id === activeId) ?? regions[0] ?? { id: "", base: 0, city: "", ms: 0 };
  const msText = useTween(active.ms, (v) => String(Math.round(v)), 450);

  const selectRegion = (id: string) => {
    if (down.includes(id)) return;
    const target = regions.find((r) => r.id === id);
    setActiveId(id);
    if (target) sweep(id, barW(target.ms));
  };

  const toggleOutage = () => {
    if (down.length > 0) {
      setDown([]);
      sweep(active.id, barW(active.ms));
      return;
    }
    const nextDown = [active.id];
    const nextActive = regions
      .filter((r) => !nextDown.includes(r.id))
      .sort((a, b) => a.ms - b.ms)[0];
    setDown(nextDown);
    if (nextActive) {
      setActiveId(nextActive.id);
      sweep(nextActive.id, barW(nextActive.ms));
    }
  };

  return (
    <CardShell id="c2" icon={cfg.icon} title={cfg.title} desc={cfg.desc} visibleRef={visibleRef}>
      <div className="toolbar">
        <div className="seg" role="tablist" aria-label="Region">
          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={r.id === active.id}
              aria-disabled={down.includes(r.id)}
              onClick={() => selectRegion(r.id)}
            >
              {r.id}
            </button>
          ))}
        </div>
        <button type="button" className="btn ghost" data-outage onClick={toggleOutage}>
          {down.length > 0 ? "Restore" : "Simulate outage"}
        </button>
      </div>
      <div className="readout">
        <div className="ms" aria-live="polite">
          <span>{msText}</span>
          <small>ms</small>
        </div>
        <div className="region-label">{active.city}</div>
      </div>
      <div className="routes">
        {regions.map((r) => {
          const isDown = down.includes(r.id);
          const isOn = r.id === active.id && !isDown;
          const w = barW(r.ms);
          return (
            <div key={r.id} className={`route${isOn ? " on" : ""}${isDown ? " down" : ""}`}>
              <span>{r.id}</span>
              <span className="tr">
                <span
                  ref={(el) => {
                    fillRefs.current[r.id] = el;
                  }}
                  className="fl"
                  style={{ "--w": w, width: w } as React.CSSProperties}
                />
              </span>
              <span>{isDown ? "down" : `${r.ms}ms`}</span>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

/* 03 · Integration beam hub (c3) */
interface WireGeo {
  k: string;
  d: string;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  delay: number;
}

function BeamCard({ cfg }: { cfg: BentoData["cards"]["beam"] }) {
  const visibleRef = useRef(true);
  const beamId = useId().replace(/:/g, "");
  const beamRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const [hotKey, setHotKey] = useState<string | null>(null);
  const [wires, setWires] = useState<WireGeo[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const beam = beamRef.current;
    const hub = hubRef.current;
    if (!beam || !hub) return;

    const draw = () => {
      const b0 = beam.getBoundingClientRect();
      if (!b0.width || !b0.height) return;
      beam.classList.toggle("tight", b0.width < 420);
      beam.classList.toggle("tiny", b0.width < 290);

      const b = beam.getBoundingClientRect();
      const h = hub.getBoundingClientRect();
      if (!h.width) return;

      const f = (v: number) => Number(v.toFixed(1));
      const next: WireGeo[] = [];

      for (const n of cfg.nodes) {
        const nodeEl = beam.querySelector<HTMLElement>(`.node[data-k="${n.k}"]`);
        if (!nodeEl) continue;
        const r = nodeEl.getBoundingClientRect();
        if (!r.width) continue;

        const cy = r.top + r.height / 2 - b.top;
        const hy = h.top + h.height / 2 - b.top + n.dy;
        const S = n.side === "l" ? { x: r.right - b.left, y: cy } : { x: h.right - b.left, y: hy };
        const E = n.side === "l" ? { x: h.left - b.left, y: hy } : { x: r.left - b.left, y: cy };
        const m = S.x + (E.x - S.x) * (n.side === "l" ? 0.52 : 0.48);

        next.push({
          k: n.k,
          d: `M ${f(S.x)} ${f(S.y)} C ${f(m)} ${f(S.y)}, ${f(m)} ${f(E.y)}, ${f(E.x)} ${f(E.y)}`,
          sx: f(S.x),
          sy: f(S.y),
          ex: f(E.x),
          ey: f(E.y),
          delay: n.delay,
        });
      }

      setBox({ w: b.width, h: b.height });
      setWires(next);
    };

    const raf = requestAnimationFrame(draw);
    const tid = window.setTimeout(draw, 40);
    const ro = new ResizeObserver(() => requestAnimationFrame(draw));
    ro.observe(beam);
    ro.observe(hub);
    if (document.fonts?.ready) document.fonts.ready.then(draw).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(tid);
      ro.disconnect();
    };
  }, [cfg.nodes]);

  const highlightBeam = (k: string) => setHotKey((prev) => (prev === k ? prev : k));
  const clearBeam = (k?: string) => setHotKey((prev) => (!k || prev === k ? null : prev));

  return (
    <CardShell id="c3" icon={cfg.icon} title={cfg.title} desc={cfg.desc} visibleRef={visibleRef}>
      <div ref={beamRef} className="beam">
        <svg
          className="wires"
          viewBox={box.w ? `0 0 ${box.w} ${box.h}` : undefined}
          aria-hidden="true"
        >
          {wires.map((w) => {
            const dx = w.ex - w.sx;
            const dy = w.ey - w.sy;
            const gid = `bg-${beamId}-${w.k}`;
            return (
              <g key={w.k} data-k={w.k}>
                <defs>
                  <linearGradient
                    id={gid}
                    gradientUnits="userSpaceOnUse"
                    x1={w.sx - 0.4 * dx}
                    y1={w.sy - 0.4 * dy}
                    x2={w.sx}
                    y2={w.sy}
                  >
                    <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
                    <stop offset="65%" stopColor="#8FA2BC" stopOpacity="1" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    <animate
                      attributeName="x1"
                      values={`${(w.sx - 0.4 * dx).toFixed(1)};${(w.sx + dx).toFixed(1)}`}
                      keyTimes="0;1"
                      calcMode="spline"
                      keySplines=".4 0 .2 1"
                      dur="1.9s"
                      begin={`${w.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y1"
                      values={`${(w.sy - 0.4 * dy).toFixed(1)};${(w.sy + dy).toFixed(1)}`}
                      keyTimes="0;1"
                      calcMode="spline"
                      keySplines=".4 0 .2 1"
                      dur="1.9s"
                      begin={`${w.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="x2"
                      values={`${w.sx.toFixed(1)};${(w.sx + 1.4 * dx).toFixed(1)}`}
                      keyTimes="0;1"
                      calcMode="spline"
                      keySplines=".4 0 .2 1"
                      dur="1.9s"
                      begin={`${w.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values={`${w.sy.toFixed(1)};${(w.sy + 1.4 * dy).toFixed(1)}`}
                      keyTimes="0;1"
                      calcMode="spline"
                      keySplines=".4 0 .2 1"
                      dur="1.9s"
                      begin={`${w.delay}s`}
                      repeatCount="indefinite"
                    />
                  </linearGradient>
                </defs>
                <path className={`base${hotKey === w.k ? " hot" : ""}`} d={w.d} />
                <path className="pulse" d={w.d} stroke={`url(#${gid})`} />
              </g>
            );
          })}
        </svg>
        {cfg.nodes.map((n) => (
          <div
            key={n.k}
            className={`node ${n.side}`}
            data-k={n.k}
            data-row={n.row}
            style={{ top: n.top }}
            onPointerEnter={() => highlightBeam(n.k)}
            onPointerDown={() => highlightBeam(n.k)}
            onPointerUp={() => clearBeam(n.k)}
            onPointerLeave={() => clearBeam(n.k)}
            onPointerCancel={() => clearBeam(n.k)}
          >
            <Icon name={n.icon} />
            <span>{n.label}</span>
          </div>
        ))}
        <div ref={hubRef} className="hub" role="img" aria-label={cfg.hubLabel}>
          <Icon name="bolt" strokeWidth={1.75} />
        </div>
      </div>
    </CardShell>
  );
}

/* 04 · Live activity & telemetry (c4) */
function ActivityCard({ cfg }: { cfg: BentoData["cards"]["activity"] }) {
  const visibleRef = useRef(true);
  const winKeys = Object.keys(cfg.windows) as Array<keyof typeof cfg.windows>;
  const [win, setWin] = useState<(typeof winKeys)[number]>(
    (cfg.defaultWindow as (typeof winKeys)[number]) ?? winKeys[0]
  );
  const [front, setFront] = useState(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frontRef = useRef(0);

  const pose = (p: number, z = 10 - p) => ({
    transform: `translateY(${p * 20}px) scale(${1 - p * 0.045})`,
    opacity: 1,
    zIndex: z,
  });

  useEffect(() => {
    const n = cfg.feed.length;
    if (n < 2) return;

    const id = window.setInterval(() => {
      if (!visibleRef.current || document.hidden) return;
      const oldFront = frontRef.current;
      const nextFront = (oldFront + 1) % n;
      frontRef.current = nextFront;
      setFront(nextFront);

      itemRefs.current.forEach((it, i) => {
        if (!it) return;
        const p = (i - nextFront + n) % n;
        const po = (i - oldFront + n) % n;
        const nextPose = pose(p);

        it.dataset.d = p === 0 ? "front" : "back";
        it.style.transform = nextPose.transform;
        it.style.opacity = String(nextPose.opacity);
        it.style.zIndex = String(nextPose.zIndex);

        if (typeof it.animate !== "function" || p === po) return;
        it.getAnimations().forEach((a) => a.cancel());

        const frames =
          p === 0
            ? [pose(po, 13), pose(0, 13)]
            : po === 0
              ? [
                  pose(0, 12),
                  { transform: "translateY(56px) scale(0.94)", opacity: 1, zIndex: 9, offset: 0.4 },
                  pose(p, 8),
                ]
              : [pose(po), pose(p)];

        it.animate(frames, {
          duration: 900,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "none",
        });
      });
    }, cfg.rotateMs);

    return () => window.clearInterval(id);
  }, [cfg.feed.length, cfg.rotateMs]);

  const metrics = cfg.windows[win] ?? cfg.windows[winKeys[0]] ?? { req: 0, p99: 0, err: 0 };
  const reqText = useTween(metrics.req, (v) => Math.round(v).toLocaleString());
  const p99Text = useTween(metrics.p99, (v) => `${Math.round(v)}ms`);
  const errText = useTween(metrics.err, (v) => `${v.toFixed(2)}%`);

  return (
    <CardShell id="c4" icon={cfg.icon} title={cfg.title} desc={cfg.desc} visibleRef={visibleRef}>
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Time window">
          {winKeys.map((w) => (
            <button key={w} type="button" aria-pressed={win === w} onClick={() => setWin(w)}>
              {w}
            </button>
          ))}
        </div>
        <span className="pill live">
          <i />
          streaming
        </span>
      </div>
      <div className="metrics">
        <div className="metric">
          <div className="k">Requests</div>
          <div className="v">{reqText}</div>
        </div>
        <div className="metric">
          <div className="k">p99 latency</div>
          <div className="v">{p99Text}</div>
        </div>
        <div className="metric">
          <div className="k">Error rate</div>
          <div className="v">{errText}</div>
        </div>
      </div>
      <div className="stack" role="list" aria-label="Recent activity">
        {cfg.feed.map((f, i) => {
          const p = (i - front + cfg.feed.length) % cfg.feed.length;
          const pos = pose(p);
          return (
            <div
              key={f.t}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="stk"
              role="listitem"
              data-d={p === 0 ? "front" : "back"}
              style={
                {
                  transform: pos.transform,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                } as React.CSSProperties
              }
            >
              <span className={`dot${f.s ? ` ${f.s}` : ""}`} />
              <span className="tx">
                <div className="tt">{f.t}</div>
                <div className="mm">{f.m}</div>
              </span>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

export default function BentoGrid({ className = "", data }: BentoGridProps) {
  const cards = {
    events: { ...defaultData.cards.events, ...data?.events },
    regions: { ...defaultData.cards.regions, ...data?.regions },
    beam: { ...defaultData.cards.beam, ...data?.beam },
    activity: { ...defaultData.cards.activity, ...data?.activity },
  };

  return (
    <div id="bento" className={`bento ${className}`.trim()}>
      <EventsCard cfg={cards.events} />
      <RegionsCard cfg={cards.regions} />
      <BeamCard cfg={cards.beam} />
      <ActivityCard cfg={cards.activity} />
    </div>
  );
}