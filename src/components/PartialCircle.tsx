import { FC, useMemo } from "react";

type Props = {
    part: number; // value in [0; 1]
    size: number;
    strokeWidth?: number;
};

const svgStyle = { transform: "rotate(-90deg)" };

export const PartialCircle: FC<Props> = ({ part, size, strokeWidth = 2 }) => {
  const normalizedSize = size - strokeWidth;
  const halfNormalizedSize = normalizedSize / 2;
  const halfSize = size / 2;
  const strokeDasharray = useMemo(() => {
    return `${part * Math.PI * normalizedSize} ${Math.PI * normalizedSize}`;
  }, [part, normalizedSize]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={svgStyle}>
      {part !== 0 && (
        <circle
          r={halfNormalizedSize}
          cx={halfSize}
          cy={halfSize}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
        />
      )}
    </svg>
  );
};
