import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useSound } from "../../hooks/useSound";
import type { DragItem, DropTarget } from "../../types/exercises";

interface DragAndDropProps {
  items: DragItem[];
  targets: DropTarget[];
  onComplete: (allCorrect: boolean) => void;
}

interface ItemPosition {
  x: number;
  y: number;
  placed: boolean;
  targetId: string | null;
}

export function DragAndDrop({ items, targets, onComplete }: DragAndDropProps) {
  const [positions, setPositions] = useState<Record<string, ItemPosition>>(() =>
    Object.fromEntries(items.map((item) => [item.id, { x: 0, y: 0, placed: false, targetId: null }]))
  );
  const [completed, setCompleted] = useState(new Set<string>());
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { play } = useSound();

  const handleDragEnd = useCallback(
    (itemId: string, info: { point: { x: number; y: number } }) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      // Check if dropped on any target
      for (const target of targets) {
        const targetEl = targetRefs.current[target.id];
        if (!targetEl) continue;

        const rect = targetEl.getBoundingClientRect();
        const { x, y } = info.point;

        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          if (target.acceptsId === itemId) {
            play("correct");
            const newCompleted = new Set(completed).add(itemId);
            setCompleted(newCompleted);
            setPositions((prev) => ({
              ...prev,
              [itemId]: { x: 0, y: 0, placed: true, targetId: target.id },
            }));

            if (newCompleted.size === items.length) {
              setTimeout(() => onComplete(true), 500);
            }
            return;
          } else {
            play("wrong");
          }
        }
      }

      // Snap back
      setPositions((prev) => ({
        ...prev,
        [itemId]: { x: 0, y: 0, placed: false, targetId: null },
      }));
    },
    [items, targets, completed, play, onComplete]
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Drop targets */}
      <div className="flex flex-wrap gap-3 justify-center">
        {targets.map((target) => {
          const placedItem = items.find(
            (item) => positions[item.id]?.targetId === target.id
          );
          return (
            <div
              key={target.id}
              ref={(el) => { targetRefs.current[target.id] = el; }}
              className={`
                min-w-[80px] min-h-[64px] rounded-2xl
                border-3 border-dashed flex items-center justify-center
                px-4 py-2 font-display font-bold text-lg
                transition-all
                ${placedItem
                  ? "border-kid-green bg-kid-green/10 text-kid-green"
                  : "border-kid-purple/40 bg-kid-purple/5 text-kid-text-light"
                }
              `}
            >
              {placedItem ? placedItem.content : target.label}
            </div>
          );
        })}
      </div>

      {/* Draggable items */}
      <div className="flex flex-wrap gap-3 justify-center">
        {items.map((item) => {
          if (completed.has(item.id)) return null;
          return (
            <motion.div
              key={item.id}
              drag
              dragSnapToOrigin
              onDragEnd={(_, info) => handleDragEnd(item.id, info)}
              whileDrag={{ scale: 1.1, zIndex: 50 }}
              className="bg-white shadow-md rounded-2xl px-5 py-3 font-display font-bold text-lg text-kid-text cursor-grab active:cursor-grabbing"
            >
              {item.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
