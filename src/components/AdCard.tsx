import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Tag, Star, Heart, Clock, Share2 } from "lucide-react";
import { Ad } from "@/data/mockAds";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAds } from "@/context/AdsContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AdCardProps {
  ad: Ad;
  index?: number;
}

export const AdCard = ({ ad, index = 0 }: AdCardProps) => {
  const { t } = useTranslation();
  const { rateAd, favorites, toggleFavorite } = useAds();
  const { isAuthenticated } = useAuth();

  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  // Fallback to 0 if undefined
  const avgRating = ad.avgRating || 0;
  const totalRatings = ad.totalRatings || 0;

  const isFavorited = favorites.includes(ad.id);

  // Check if deal is expiring within 48 hours
  const isExpiringSoon = (() => {
    if (!ad.validUntil) return false;
    const expiryDate = new Date(ad.validUntil);
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff > 0 && hoursDiff <= 48;
  })();

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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to AdDetail when clicking the heart
    e.stopPropagation();
    toggleFavorite(ad.id);
    if (!isFavorited) {
      toast.success(t("adCard.savedToFavorites", "Saved to Favorites ❤️"));
    } else {
      toast.info(t("adCard.removedFromFavorites", "Removed from Favorites"));
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/ad/${ad.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: ad.title, text: ad.description, url });
      } catch {
        // user cancelled — no action needed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group overflow-hidden border-border/50 bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
        <Link to={`/ad/${ad.id}`} className="block relative overflow-hidden">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            loading="lazy"
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Wishlist Heart Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleToggleFavorite}
            className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-colors"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isFavorited ? "fill-red-500 text-red-500" : "fill-transparent text-white"
              )}
            />
          </motion.button>

          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1 shadow-lg">
              {ad.discount}
            </Badge>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Share Button - revealed on hover */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleShare}
            className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Share2 className="w-4 h-4 text-white" />
          </motion.button>
        </Link>
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

          <Link to={`/ad/${ad.id}`}>
            <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {ad.title}
            </h3>
          </Link>
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
              {isExpiringSoon && (
                <Badge variant="destructive" className="ml-2 animate-pulse text-[10px] py-0 px-1.5 h-5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t("adCard.expiringSoon", "Expiring Soon!")}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
