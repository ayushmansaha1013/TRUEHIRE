import { motion } from "framer-motion";

export default function ScoreGauge({ score }) {
  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getRisk = (score) => {
    if (score >= 70) {
      return {
        label: "HIGH RISK",
        color: "#ff4d6d",
      };
    }

    if (score >= 40) {
      return {
        label: "MEDIUM RISK",
        color: "#ffb020",
      };
    }

    return {
      label: "LOW RISK",
      color: "#22c55e",
    };
  };

  const risk = getRisk(score);

  return (
    <div className="relative mx-auto h-64 w-64">
      <svg className="-rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.07)"
          strokeWidth="12"
        />

        {/* Score circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={risk.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-[.25em] text-slate-500">
          Fraud Score
        </span>

        <motion.span
          className="text-7xl font-black"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {score}
        </motion.span>

        <motion.span
          className="text-sm font-bold"
          style={{ color: risk.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {risk.label}
        </motion.span>
      </div>
    </div>
  );
}