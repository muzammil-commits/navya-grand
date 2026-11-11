import React from "react";
import type { VegType } from "@/lib/types";

export function VegBadge({
  vegType,
  showLabel = false,
}: {
  vegType: VegType;
  showLabel?: boolean;
}) {
  const isVeg = vegType === "veg";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-[3px] border-[1.5px] bg-white shrink-0 ${
          isVeg ? "border-emerald-700" : "border-red-700"
        }`}
        title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
        aria-label={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isVeg ? "bg-emerald-700" : "bg-red-700"
          }`}
        />
      </span>
      {showLabel && (
        <span
          className={`text-xs font-semibold ${
            isVeg ? "text-emerald-800" : "text-red-800"
          }`}
        >
          {isVeg ? "Pure Veg" : "Non-Veg"}
        </span>
      )}
    </span>
  );
}

