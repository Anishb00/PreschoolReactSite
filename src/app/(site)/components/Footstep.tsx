"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FootstepProps {
  top: string;
  left: string;
  rotate: string;
  index: number;
  mirror: boolean;
}

export default function Footstep({
  top,
  left,
  rotate,
  index,
  mirror,
}: FootstepProps) {
  const footRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footRef.current) {
      const el = footRef.current;

      gsap.fromTo(
        el,
        {
          opacity: 0,
          scale: 1,
          y: "-20px", // Higher drop
        },
        {
          opacity: 1,
          y: "0px",
          scale: 0.85, // Stronger squash
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(el, {
              scale: 1.03, // Slight bounce past 1
              duration: 0.15,
              ease: "power1.out",
              onComplete: () => {
                gsap.to(el, {
                  scale: 1,
                  duration: 0.1,
                  ease: "sine.out",
                });
              },
            });
          },
        },
      );
    }
  }, []);

  return (
    <div
      ref={footRef}
      className="pointer-events-none absolute h-8 w-8"
      style={{ top, left }}
    >
      <img
        src={`/${mirror ? "rightfoot.png" : "leftfoot.png"}`}
        alt={`Footstep ${index}`}
        className={`h-full w-full ${rotate}`}
      />
    </div>
  );
}
