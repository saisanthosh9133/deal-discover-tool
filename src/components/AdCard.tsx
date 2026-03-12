import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Tag, Star } from "lucide-react";
import { Ad } from "@/data/mockAds";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAds } from "@/context/AdsContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdCardProps {
  ad: Ad;
  index?: number;
}

export const AdCard = ({ ad, index = 0 }: AdCardProps) => {
  const { t } = useTranslation();
  const { rateAd } = useAds();
  const { isAuthenticated } = useAuth();

  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  // Fallback to 0 if undefined
  const avgRating = ad.avgRating || 0;
  const totalRatings = ad.totalRatings || 0;

  const handleRate = async (value: number) => {
    if (!isAuthenticated) {
      toast.error(t("auth.loginRequired", "Please login to rate ads"));
      return;
    }

    try {
      setIsRating(true);
      await rateAd(ad.id, value);
      toast.success(t("adCard.rateSuccess", "Thank you for rating!"));
    } catch (error: any) {
      toast.error(error.message || t("adCard.rateError", "Failed to submit rating"));
    } finally {
      setIsRating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group overflow-hidden border-border/50 bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1 shadow-lg">
              {ad.discount}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{ad.city}</span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-primary font-medium">{ad.businessName}</span>
            </div>

            {/* Star Rating Display */}
            <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({totalRatings})</span>
            </div>
          </div>

          <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {ad.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 mt-1">
            {ad.description}
          </p>

          {/* Interactive Rating UI */}
          <div className="mb-4 flex items-center gap-1.5 border-t border-border/50 pt-3">
            <span className="text-xs text-muted-foreground mr-1">
              {t("adCard.rateThis", "Rate:")}
            </span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isRating}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRate(star);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none disabled:opacity-50 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-4 h-4 transition-colors",
                    (hoverRating || 0) >= star || (!hoverRating && avgRating >= star)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-transparent text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {ad.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {keyword}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t("adCard.validUntil")} {new Date(ad.validUntil).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
