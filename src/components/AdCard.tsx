import { motion } from "framer-motion";
import { MapPin, Calendar, Tag } from "lucide-react";
import { Ad } from "@/data/mockAds";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AdCardProps {
  ad: Ad;
  index?: number;
}

export const AdCard = ({ ad, index = 0 }: AdCardProps) => {
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
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1 shadow-lg">
              {ad.discount}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{ad.city}</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-primary font-medium">{ad.businessName}</span>
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {ad.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {ad.description}
          </p>
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
              <span>Until {new Date(ad.validUntil).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
