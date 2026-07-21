import { useEffect, useRef } from "react";

export default function ShapeGrid({
  speed = 0.5,
  squareSize = 40,
  direction = "diagonal",
  borderColor = "#ffffff",
  hoverFillColor = "#111827",
  shape = "hexagon",
  hoverTrailAmount = 5,
  className = "",
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const trailRef = useRef([]);
  const animationFrameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let resizeTimeout;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    resize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      trailRef.current = [];
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      timeRef.current += 0.01 * speed;

      ctx.clearRect(0, 0, w, h);

      const gap = squareSize + 8;
      const cols = Math.ceil(w / gap) + 2;
      const rows = Math.ceil(h / gap) + 2;

      // Calculate offset based on direction
      let offsetX = 0;
      let offsetY = 0;
      const t = timeRef.current * 20;

      switch (direction) {
        case "up":
          offsetY = -((t * speed) % gap);
          break;
        case "down":
          offsetY = (t * speed) % gap;
          break;
        case "left":
          offsetX = -((t * speed) % gap);
          break;
        case "right":
          offsetX = (t * speed) % gap;
          break;
        case "diagonal":
        default:
          offsetX = -((t * speed) % gap);
          offsetY = -((t * speed * 0.7) % gap);
          break;
      }

      // Add mouse trail point
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx >= 0 && my >= 0) {
        trailRef.current.push({ x: mx, y: my, age: 0 });
        if (trailRef.current.length > hoverTrailAmount) {
          trailRef.current.shift();
        }
      }

      // Age the trail
      trailRef.current = trailRef.current
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < hoverTrailAmount * 5);

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = c * gap + offsetX;
          const cy = r * gap + offsetY;

          // Check if mouse is near this shape
          let isHovered = false;
          for (const tp of trailRef.current) {
            const dx = cx + squareSize / 2 - tp.x;
            const dy = cy + squareSize / 2 - tp.y;
            if (Math.sqrt(dx * dx + dy * dy) < squareSize * 0.8) {
              isHovered = true;
              break;
            }
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1.5;

          if (isHovered) {
            ctx.fillStyle = hoverFillColor;
          }

          const drawShape = () => {
            const s = squareSize * 0.85;
            switch (shape) {
              case "square":
                if (isHovered) {
                  ctx.fillRect(cx + (squareSize - s) / 2, cy + (squareSize - s) / 2, s, s);
                }
                ctx.strokeRect(cx + 2, cy + 2, squareSize - 4, squareSize - 4);
                break;

              case "hexagon": {
                const hw = s / 2;
                const hh = (s * Math.sqrt(3)) / 4;
                const hexCx = cx + squareSize / 2;
                const hexCy = cy + squareSize / 2;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                  const angle = (Math.PI / 3) * i - Math.PI / 6;
                  const px = hexCx + hw * Math.cos(angle);
                  const py = hexCy + hh * Math.sin(angle) * 2;
                  i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.closePath();
                if (isHovered) ctx.fill();
                ctx.stroke();
                break;
              }

              case "circle": {
                const radius = squareSize / 2 - 3;
                const circx = cx + squareSize / 2;
                const circy = cy + squareSize / 2;
                ctx.beginPath();
                ctx.arc(circx, circy, radius, 0, Math.PI * 2);
                ctx.closePath();
                if (isHovered) ctx.fill();
                ctx.stroke();
                break;
              }

              case "triangle": {
                const hw = s / 2;
                const triCx = cx + squareSize / 2;
                const triCy = cy + squareSize / 2 + hw * 0.4;
                ctx.beginPath();
                ctx.moveTo(triCx, triCy - hw);
                ctx.lineTo(triCx - hw, triCy + hw * 0.6);
                ctx.lineTo(triCx + hw, triCy + hw * 0.6);
                ctx.closePath();
                if (isHovered) ctx.fill();
                ctx.stroke();
                break;
              }

              default: {
                const hw = s / 2;
                const hh = (s * Math.sqrt(3)) / 4;
                const hexCx = cx + squareSize / 2;
                const hexCy = cy + squareSize / 2;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                  const angle = (Math.PI / 3) * i - Math.PI / 6;
                  const px = hexCx + hw * Math.cos(angle);
                  const py = hexCy + hh * Math.sin(angle) * 2;
                  i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.closePath();
                if (isHovered) ctx.fill();
                ctx.stroke();
              }
            }
          };

          drawShape();
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor, shape, hoverTrailAmount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", pointerEvents: "auto" }}
    />
  );
}

