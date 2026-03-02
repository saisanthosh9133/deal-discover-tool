import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 32, text: "text-xl" },
    md: { icon: 48, text: "text-2xl" },
    lg: { icon: 72, text: "text-4xl" },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          className="text-primary"
        >
          {/* Central circle */}
          <circle
            cx="50"
            cy="50"
            r="28"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          {/* Radiating spikes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.line
              key={i}
              x1="50"
              y1="50"
              x2={50 + Math.cos((angle * Math.PI) / 180) * 45}
              y2={50 + Math.sin((angle * Math.PI) / 180) * 45}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}
          {/* Inner design - D letter stylized */}
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="currentColor"
            fontSize="24"
            fontWeight="bold"
            fontFamily="serif"
          >
            D
          </text>
        </svg>
      </div>
      {showText && (
        <div className={`font-display font-bold tracking-tight ${currentSize.text}`}>
          <span className="text-primary">Deal</span>
          <span className="text-muted-foreground">Discover</span>
        </div>
      )}
    </motion.div>
  );
};
