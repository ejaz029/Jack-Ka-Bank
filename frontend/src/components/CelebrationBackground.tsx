import { useEffect } from "react";
import confetti from "canvas-confetti";

interface CelebrationBackgroundProps {
  trigger: number;
}

export default function CelebrationBackground({ trigger }: CelebrationBackgroundProps) {
  useEffect(() => {
    if (trigger <= 0) {
      return;
    }

    const end = Date.now() + 1200;
    const colors = ["#0ea5e9", "#22c55e", "#f97316", "#eab308", "#ef4444"];

    const frame = () => {
      confetti({
        particleCount: 5,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.5,
        },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger]);

  return <div className="animated-backdrop" aria-hidden="true" />;
}
