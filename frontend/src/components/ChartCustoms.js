import { useContext } from "react";
import { SiteContext } from "../SiteContext";

export const xAxisFormatter = (item) => {
  if (!item) return;
  if (typeof item !== "string") return;
  return item.slice(3, 10);
};

export const yAxisFormatter = (item) => {
  if (!item) return;
  return Number(item).toFixed(0);
};

export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="flex items-center justify-center text-sm space-x-2 bg-black text-white rounded px-1">
      <div className="">{label}:</div>
      <div className="font-semibold">{payload[0]?.value.toFixed(2)}</div>
    </div>
  );
};

export const CustomLineDot = ({ cx, cy, stroke, payload, value }) => {
  const { actionStylesHex } = useContext(SiteContext);

  const r = 8;
  const strokeColor = "black";
  const strokeWidth = 1.6;
  const strokeOpacity = 0.8;

  if (!payload || !payload?.action) return null;

  return (
    <>
      <circle
        id={payload.id}
        cx={cx}
        cy={cy}
        r={r}
        fill={actionStylesHex[payload.action.toLowerCase()]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
      />
      <text x={cx} y={cy} textAnchor="middle" fill="#000" alignmentBaseline="central" fontSize="0.75rem">
        {payload.action[0].toUpperCase()}
      </text>
    </>
  );
};
