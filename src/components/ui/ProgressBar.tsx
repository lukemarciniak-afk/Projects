import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = "bg-kid-green" }: ProgressBarProps) {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
}
