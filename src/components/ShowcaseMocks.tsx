import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/hooks/use-language";
import { NumberTicker } from "./magicui/number-ticker";

const inView = { once: true, margin: "-60px" } as const;

export function InventoryMock() {
  const { mock } = useLanguage().t.showcase;
  const reduceMotion = useReducedMotion();
  const bars = [82, 64, 18, 90, 47];
  return (
    <div className="flex h-full flex-col bg-ink p-5 text-paper">
      <p className="text-xs uppercase tracking-widest text-[#C9BFB2]">{mock.stock}</p>
      <p className="font-display text-4xl font-bold"><NumberTicker value={1284} /></p>
      <div className="mt-auto space-y-2.5">
        {bars.map((width, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="h-2 w-10 rounded-full bg-paper/15" />
            <div className="h-2.5 flex-1 rounded-full bg-paper/10">
              <motion.div
                className={i === 2 ? "h-full rounded-full bg-rust" : "h-full rounded-full bg-[#E9A58F]"}
                initial={{ width: reduceMotion ? `${width}%` : 0 }}
                whileInView={{ width: `${width}%` }}
                viewport={inView}
                transition={{ duration: 0.9, delay: 0.1 * i, ease: "easeOut" }}
              />
            </div>
            {i === 2 && <span className="rounded bg-rust px-1.5 py-0.5 text-[10px] font-semibold text-white">{mock.lowStock}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RestaurantMock() {
  const { mock } = useLanguage().t.showcase;
  const dishes = [
    { name: mock.dish1, price: "$2.50" },
    { name: mock.dish2, price: "$3.75" },
    { name: mock.dish3, price: "$2.00" },
  ];
  return (
    <div className="flex h-full flex-col bg-pine p-5 text-white">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-2xl font-bold">Taquería</p>
        <p className="text-xs text-pine-soft">{mock.ordersToday}: <NumberTicker value={48} className="font-semibold text-white" /></p>
      </div>
      <ul className="mt-auto space-y-2">
        {dishes.map((dish, i) => (
          <motion.li
            key={dish.name}
            className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ delay: 0.15 * i, duration: 0.45 }}
          >
            <span>{dish.name} <span className="text-white/90">{dish.price}</span></span>
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-pine">{mock.add}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function StoreMock() {
  const { mock } = useLanguage().t.showcase;
  return (
    <div className="flex h-full flex-col bg-cobalt p-5 text-white">
      <div className="flex items-center justify-between">
        <span className="h-3 w-20 rounded-full bg-white/30" />
        <span className="relative rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-cobalt">
          {mock.cart}
          <motion.span
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rust text-[10px] text-white"
            initial={{ scale: 0 }}
            whileInView={{ scale: [0, 1.35, 1] }}
            viewport={inView}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            3
          </motion.span>
        </span>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2.5">
        {["rounded-full", "rounded-lg", "rotate-45 rounded-sm"].map((shape, i) => (
          <motion.div
            key={shape}
            className="flex aspect-[3/4] items-center justify-center rounded-lg bg-white"
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={inView}
            transition={{ delay: 0.12 * i, duration: 0.5 }}
          >
            <span className={`h-8 w-8 bg-cobalt-soft ${shape}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function AuditMock() {
  const { mock } = useLanguage().t.showcase;
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex h-full items-center gap-6 border-b border-dashed border-ink/20 bg-paper p-5">
      <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#D9CCBA" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r="50" fill="none" stroke="#B5482C" strokeWidth="10" strokeLinecap="round"
          initial={{ pathLength: reduceMotion ? 0.92 : 0 }}
          whileInView={{ pathLength: 0.92 }}
          viewport={inView}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="space-y-3 text-ink">
        <p className="text-xs uppercase tracking-widest text-ink-muted">{mock.securityScore}</p>
        <p className="font-display text-5xl font-bold leading-none"><NumberTicker value={92} /><span className="text-2xl text-ink-muted">/100</span></p>
        <p className="text-sm text-ink-muted">{mock.risksFound}: <b className="text-ink">7</b> · {mock.fixed}: <b className="text-pine">7</b></p>
      </div>
    </div>
  );
}
