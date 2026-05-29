interface ScrollZoomRevealProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export default function ScrollZoomReveal({
  children,
  className = "",
  duration = 1000,
}: ScrollZoomRevealProps) {
  return (
    <div
      style={{
        animationDuration: `${duration}ms`,
      }}
      className={`
        timeline-view
        animate-zoom-in
        animate-range-cover
        ${className}
      `}
    >
      {children}
    </div>
  );
}
