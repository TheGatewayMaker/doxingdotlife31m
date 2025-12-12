import { useEffect, useRef } from "react";

interface Snowflake {
  id: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  swing: number;
  opacity: number;
}

const SnowfallEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const generateSnowflakes = () => {
      const flakes: Snowflake[] = [];
      const count =
        window.innerWidth < 768 ? 20 : window.innerWidth < 1024 ? 30 : 50;

      for (let i = 0; i < count; i++) {
        flakes.push({
          id: `snowflake-${i}`,
          x: Math.random() * 100,
          size: Math.random() * (4 - 1.5) + 1.5,
          duration: Math.random() * (20 - 10) + 10,
          delay: Math.random() * 5,
          swing: Math.random() * 100 - 50,
          opacity: Math.random() * (0.8 - 0.3) + 0.3,
        });
      }
      return flakes;
    };

    snowflakesRef.current = generateSnowflakes();

    // Clear existing snowflakes
    container.innerHTML = "";

    // Create snowflake elements
    snowflakesRef.current.forEach((flake) => {
      const snowflake = document.createElement("div");
      snowflake.className =
        "fixed pointer-events-none select-none animate-snowfall";
      snowflake.innerHTML = "❄";

      snowflake.style.cssText = `
        left: ${flake.x}%;
        top: -10px;
        font-size: ${flake.size}px;
        opacity: ${flake.opacity};
        animation: snowfall ${flake.duration}s linear ${flake.delay}s infinite;
        --tx: ${flake.swing}px;
        z-index: 10;
        text-shadow: 0 0 8px rgba(0, 136, 204, 0.3);
      `;

      // Add horizontal swing animation as a secondary transform
      const swingStyle = document.createElement("style");
      swingStyle.innerHTML = `
        #${flake.id} {
          animation: snowfall ${flake.duration}s linear ${flake.delay}s infinite,
                    snowswing ${flake.duration * 0.8}s ease-in-out ${flake.delay}s infinite;
        }
      `;
      document.head.appendChild(swingStyle);

      snowflake.id = flake.id;
      container.appendChild(snowflake);
    });

    // Regenerate snowflakes when window is resized
    const handleResize = () => {
      snowflakesRef.current = generateSnowflakes();
      container.innerHTML = "";

      snowflakesRef.current.forEach((flake) => {
        const snowflake = document.createElement("div");
        snowflake.className =
          "fixed pointer-events-none select-none animate-snowfall";
        snowflake.innerHTML = "❄";

        snowflake.style.cssText = `
          left: ${flake.x}%;
          top: -10px;
          font-size: ${flake.size}px;
          opacity: ${flake.opacity};
          animation: snowfall ${flake.duration}s linear ${flake.delay}s infinite;
          --tx: ${flake.swing}px;
          z-index: 10;
          text-shadow: 0 0 8px rgba(0, 136, 204, 0.3);
        `;

        const swingStyle = document.createElement("style");
        swingStyle.innerHTML = `
          #${flake.id} {
            animation: snowfall ${flake.duration}s linear ${flake.delay}s infinite,
                      snowswing ${flake.duration * 0.8}s ease-in-out ${flake.delay}s infinite;
          }
        `;
        document.head.appendChild(swingStyle);

        snowflake.id = flake.id;
        container.appendChild(snowflake);
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      // Clean up styles
      const styles = document.querySelectorAll(
        'style[id*="snowflake-"]'
      ) as NodeListOf<HTMLStyleElement>;
      styles.forEach((style) => style.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden z-0"
      style={{
        mixBlendMode: "screen",
      }}
    />
  );
};

export default SnowfallEffect;
