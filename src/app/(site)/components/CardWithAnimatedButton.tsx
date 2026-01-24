"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";

type Props = {
  text?: string;
  image?: string;
};

const CardWithAnimatedButton: React.FC<Props> = ({
  text = "Our Prospectus >",
  image = "/herobg.jpeg",
}) => {
  const buttonWrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseEnter = () => {
    if (buttonWrapperRef.current && buttonRef.current) {
      // Animate wrapper height from 0 to auto
      gsap.fromTo(
        buttonWrapperRef.current,
        { height: 0 },
        {
          height: "auto",
          duration: 0.5,
          ease: "power1.inOut",
        },
      );

      // Fade and slide in button
      gsap.to(buttonRef.current, {
        autoAlpha: 1, // opacity + visibility
        y: 0,
        duration: 0.5,
        ease: "power1.inOut",
        delay: 0.1,
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonWrapperRef.current && buttonRef.current) {
      // Fade and slide out button
      gsap.to(buttonRef.current, {
        autoAlpha: 0,
        y: 10,
        duration: 0.3,
        ease: "power1.inOut",
      });

      // Collapse wrapper height
      gsap.to(buttonWrapperRef.current, {
        height: 0,
        duration: 0.4,
        ease: "power1.inOut",
        delay: 0.05,
      });
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[420px] md:min-h-[500px] flex-none md:flex-1 flex-col justify-end overflow-hidden bg-[#3a249c] p-6 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('${image}')` }}
      />

      <div className="relative z-10 border-t border-[#FFCC00] pt-4">
        <h2 className="text-3xl">{text}</h2>
      </div>

      {/* Animated Button Wrapper */}
      <div
        ref={buttonWrapperRef}
        className="relative z-10 mt-4 h-0 overflow-hidden"
      >
        <button
          ref={buttonRef}
          className="rounded bg-[#FFCC00] px-4 py-2 font-semibold text-purple-900"
          style={{
            opacity: 0,
            visibility: "hidden",
            transform: "translateY(10px)",
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default CardWithAnimatedButton;
