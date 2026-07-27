import {useEffect, useRef, useState} from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1100,
  locale = "fr-MG",
  prefix = "",
  suffix = "",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  className
}: AnimatedCounterProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const [displayedValue, setDisplayedValue] = useState(0);
  const displayedRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || duration <= 0) {
      displayedRef.current = safeValue;
      setDisplayedValue(safeValue);
      return;
    }

    const startValue = displayedRef.current;
    const difference = safeValue - startValue;
    const startTime = performance.now();
    let frameId = 0;

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + difference * easedProgress;
      displayedRef.current = nextValue;
      setDisplayedValue(nextValue);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [duration, safeValue]);

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });
  const finalText = `${prefix}${formatter.format(safeValue)}${suffix}`;
  const animatedText = `${prefix}${formatter.format(displayedValue)}${suffix}`;

  return <span className={className} aria-label={finalText}>
    <span aria-hidden="true">{animatedText}</span>
  </span>;
}
