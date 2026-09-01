import { motion } from "framer-motion";
import { stats } from "../data/mock";

export default function StatTicker() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="panel p-5"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * .1 }}
        >
          <div className="text-2xl font-black text-cyan">{s.value.toLocaleString()}</div>
          <div className="mt-1 text-sm text-slate-500">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}