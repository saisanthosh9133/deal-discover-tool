import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <span className="text-8xl font-bold text-primary/20">404</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <SearchX className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            {t("notFound.title")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t("notFound.desc", { path: "" }).split("<1>")[0]}
            <code className="text-primary text-sm bg-secondary px-2 py-0.5 rounded">
              {location.pathname}
            </code>
            {t("notFound.desc", { path: "" }).split("</1>")[1]}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/">
              <Button className="gap-2">
                <Home className="w-4 h-4" />
                {t("notFound.goHome")}
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("notFound.goBack")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
