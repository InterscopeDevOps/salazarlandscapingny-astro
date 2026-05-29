import { useEffect, useRef, useState } from "react";

type AnimationType =
  | "fade"
  | "fade-blur-in"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right";

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export default function FadeInOnScroll({
  children,
  className = "",
  type = "fade-up",
  delay = 0,
  duration = 700,
  once = true,
  threshold = 0.2,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else {
          if (!once) setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [once, threshold]);

  const getInitialTransform = () => {
    switch (type) {
      case "fade-up":
        return "opacity-0 translate-y-6";
      case "fade-down":
        return "opacity-0 -translate-y-6";
      case "fade-left":
        return "opacity-0 translate-x-6";
      case "fade-right":
        return "opacity-0 -translate-x-6";
      case "fade-blur-in":
        return "opacity-0 blur-sm";
      case "fade":
      default:
        return "opacity-0";
    }
  };

  const getVisibleTransform = () => {
    switch (type) {
      case "fade-up":
      case "fade-down":
        return "opacity-100 translate-y-0";
      case "fade-left":
      case "fade-right":
        return "opacity-100 translate-x-0";
      case "fade-blur-in":
        return "opacity-100 blur-none";
      case "fade":
      default:
        return "opacity-100";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`
        transition-all ease-out will-change-transform
        ${isVisible ? getVisibleTransform() : getInitialTransform()}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
