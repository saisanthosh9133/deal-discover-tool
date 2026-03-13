import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 36, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8B1D2D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transform"
        >
          {/* Nautical Helm / Steering Wheel Icon */}
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="M22 12h-3" />
          <path d="M5 12H2" />
          <path d="M19.07 4.93l-2.12 2.12" />
          <path d="M7.05 16.95l-2.12 2.12" />
          <path d="M19.07 19.07l-2.12-2.12" />
          <path d="M7.05 7.05l-2.12-2.12" />
        </svg>
      </div>
      {showText && (
        <div className={`font-bold tracking-tight ${currentSize.text} flex`}>
          <span className="text-[#8B1D2D]">Deal</span>
          <span className="text-[#6B5A5A]">Discover</span>
        </div>
      )}
    </motion.div>
  );
};
