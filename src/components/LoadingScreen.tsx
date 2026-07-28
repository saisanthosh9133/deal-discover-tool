import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 800); // Wait for exit animation
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Logo Animation - Nautical Helm */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0, 0.71, 0.2, 1.01],
                                scale: {
                                    type: "spring",
                                    damping: 12,
                                    stiffness: 100,
                                },
                            }}
                            className="mb-8"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 flex items-center justify-center"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#8B1D2D"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-full h-full"
                                    >
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
                                </motion.div>

                                {/* Pulse effect */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.1, 0.3, 0.1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-[#8B1D2D] rounded-full blur-2xl -z-10"
                                />
                            </div>
                        </motion.div>

                        {/* Text Animation */}
                        <div className="overflow-hidden flex flex-col items-center">
                            <div className="flex space-x-2">
                                <motion.span
                                    initial={{ y: 100 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                    className="text-5xl md:text-7xl font-bold tracking-tighter text-[#8B1D2D]"
                                >
                                    Deal
                                </motion.span>
                                <motion.span
                                    initial={{ y: 100 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                    className="text-5xl md:text-7xl font-bold tracking-tighter text-[#6B5A5A]"
                                >
                                    Discover
                                </motion.span>
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                className="mt-4 text-muted-foreground font-medium tracking-widest uppercase text-sm"
                            >
                                Discover amazing offers near you
                            </motion.p>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 300, opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
                            className="mt-12 h-1 bg-muted rounded-full overflow-hidden"
                        >
                            <motion.div
                                initial={{ left: "-100%" }}
                                animate={{ left: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="relative w-full h-full bg-gradient-to-r from-transparent via-[#8B1D2D] to-transparent"
                            />
                        </motion.div>
                    </div>

                    {/* Background Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
