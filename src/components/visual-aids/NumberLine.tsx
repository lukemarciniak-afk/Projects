import { motion } from "framer-motion";

interface NumberLineProps {
  max?: number;
  highlight?: number;
  hops?: { from: number; count: number; direction: "forward" | "backward" };
}

export function NumberLine({ max = 10, highlight, hops }: NumberLineProps) {
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);
  const hopPositions: number[] = [];

  if (hops) {
    for (let i = 0; i <= hops.count; i++) {
      const pos =
        hops.direction === "forward" ? hops.from + i : hops.from - i;
      hopPositions.push(pos);
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-end gap-0 min-w-max px-2">
        {numbers.map((n) => {
          const isHighlighted = highlight === n;
          const isHop = hopPositions.includes(n);
          const isStart = hops?.from === n;
          const isEnd = hopPositions.length > 0 && hopPositions[hopPositions.length - 1] === n;

          return (
            <div key={n} className="flex flex-col items-center" style={{ width: 36 }}>
              {isEnd && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: (hops?.count ?? 0) * 0.2, type: "spring" }}
                  className="text-lg mb-1"
                >
                  &#128056;
                </motion.div>
              )}
              {isStart && !isEnd && (
                <div className="text-sm mb-1 text-kid-blue">&#128056;</div>
              )}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-display font-bold text-sm transition-all
                  ${isHighlighted || isEnd
                    ? "bg-kid-purple text-white scale-110"
                    : isHop
                      ? "bg-kid-blue/20 text-kid-blue"
                      : "bg-gray-100 text-kid-text-light"
                  }
                `}
              >
                {n}
              </div>
              <div
                className={`w-0.5 h-3 mt-1 ${
                  isHop ? "bg-kid-blue" : "bg-gray-200"
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="h-0.5 bg-gray-200 -mt-0.5 mx-2 rounded-full" />
    </div>
  );
}
