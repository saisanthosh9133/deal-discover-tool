import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import api from "@/context/AuthContext";
import { Ad, mockAds } from "@/data/mockAds";
import { MapPin, Calendar, Tag, ArrowLeft, Star, Store, Loader2, Heart, Clock, Eye, Share2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAds } from "@/context/AdsContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MapPicker } from "@/components/MapPicker";

export default function AdDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { rateAd, ads, favorites, toggleFavorite } = useAds();
    const { isAuthenticated } = useAuth();

    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [hoverRating, setHoverRating] = useState(0);
    const [isRating, setIsRating] = useState(false);
    const [userRating, setUserRating] = useState<number>(0);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                setLoading(true);
                // Try backend first to get the latest views and ratings
                const response = await api.get(`/ads/${id}`);
                if (response.data.success) {
                    const sAd = response.data.ad;
                    setAd({
                        id: sAd.id || sAd._id,
                        title: sAd.title,
                        description: sAd.description,
                        imageUrl: sAd.imageUrl || "",
                        keywords: sAd.keywords || [],
                        city: sAd.city,
                        discount: sAd.discount || "SPECIAL OFFER",
                        businessName: sAd.businessName,
                        validUntil: sAd.validUntil ? new Date(sAd.validUntil).toISOString().split("T")[0] : "",
                        avgRating: sAd.avgRating || 0,
                        totalRatings: sAd.totalRatings || 0,
                        views: sAd.views || 0,
                        location: sAd.location || undefined,
                    });
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.warn("Could not fetch from backend, trying context/mock data");
            }

            // Fallback to frontend context/mock data if backend is down or ad not found on backend (mock data)
            const foundAd = ads.find((a) => a.id === id) || mockAds.find((a) => a.id === id);
            if (foundAd) {
                setAd(foundAd);
            }
            setLoading(false);
        };

        if (id) {
            fetchAdDetails();
        }
    }, [id, ads]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: ad?.title, text: ad?.description, url });
            } catch {
                // user cancelled — no action needed
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    // Dynamic page title
    useEffect(() => {
        if (ad) {
            document.title = `${ad.title} — DealDiscover`;
        }
        return () => { document.title = "DealDiscover"; };
    }, [ad]);

    // Load user's own rating for this ad from localStorage
    useEffect(() => {
        if (ad?.id) {
            const stored = localStorage.getItem(`dd_rating_${ad.id}`);
            if (stored) setUserRating(parseInt(stored, 10));
            else setUserRating(0);
        }
    }, [ad?.id]);

    const handleRate = async (value: number) => {
        if (!isAuthenticated) {
            toast.error(t("auth.loginRequired", "Please login to rate ads"));
            navigate("/login");
            return;
        }
        if (!ad) return;
        if (userRating > 0) {
            toast.info("You have already rated this deal.");
            return;
        }

        try {
            setIsRating(true);
            await rateAd(ad.id, value);
            setUserRating(value);
            localStorage.setItem(`dd_rating_${ad.id}`, String(value));
            toast.success(t("adCard.rateSuccess", "Thank you for rating!"));

            // Optimistically update UI
            setAd(prev => {
                if (!prev) return prev;
                const newTotal = (prev.totalRatings || 0) + 1;
                const newAvg = ((prev.avgRating || 0) * (prev.totalRatings || 0) + value) / newTotal;
                return {
                    ...prev,
                    totalRatings: newTotal,
                    avgRating: newAvg
                };
            });
        } catch (error: any) {
            const msg: string = error.message || "";
            if (msg.toLowerCase().includes("already")) {
                // Backend says already rated — persist locally so UI reflects it
                setUserRating(value);
                localStorage.setItem(`dd_rating_${ad.id}`, String(value));
                toast.info("You have already rated this deal.");
            } else {
                toast.error(msg || t("adCard.rateError", "Failed to submit rating"));
            }
        } finally {
            setIsRating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <NavBar />
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">{t("adDetail.loading", "Loading ad details...")}</p>
            </div>
        );
    }

    if (!ad) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <NavBar />
                <h1 className="text-2xl font-bold mb-4">{t("adDetail.notFound", "Ad not found")}</h1>
                <Button onClick={() => navigate("/")}>{t("adDetail.backToHome", "Back to Home")}</Button>
            </div>
        );
    }

    const avgRating = ad.avgRating || 0;
    const totalRatings = ad.totalRatings || 0;

    const isFavorited = favorites.includes(ad.id);

    const isExpiringSoon = (() => {
        if (!ad.validUntil) return false;
        const expiryDate = new Date(ad.validUntil);
        const now = new Date();
        const timeDiff = expiryDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        return hoursDiff > 0 && hoursDiff <= 48;
    })();

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        className="w-fit -ml-4 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("adDetail.back", "Back")}
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="relative rounded-2xl overflow-hidden shadow-xl h-[300px] md:h-[500px]">
                        <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />

                        {/* Wishlist Heart Button */}
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => {
                                toggleFavorite(ad.id);
                                if (!isFavorited) {
                                    toast.success(t("adCard.savedToFavorites", "Saved to Favorites ❤️"));
                                } else {
                                    toast.info(t("adCard.removedFromFavorites", "Removed from Favorites"));
                                }
                            }}
                            className="absolute top-4 left-4 z-10 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-colors shadow-lg"
                        >
                            <Heart
                                className={cn(
                                    "w-6 h-6 transition-colors duration-300",
                                    isFavorited ? "fill-red-500 text-red-500" : "fill-transparent text-white"
                                )}
                            />
                        </motion.button>

                        <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-primary-foreground font-bold text-lg px-4 py-2 shadow-lg">
                                {ad.discount}
                            </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge variant="secondary" className="px-3 py-1 font-medium bg-secondary/80">
                                <Store className="w-3.5 h-3.5 mr-1" />
                                {ad.businessName}
                            </Badge>
                            <a
                                href={
                                    ad.location
                                        ? `https://maps.google.com/?q=${ad.location.lat},${ad.location.lng}`
                                        : `https://maps.google.com/?q=${encodeURIComponent(`${ad.businessName} ${ad.city}`)}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-muted-foreground text-sm bg-background/50 px-2 py-1 rounded-md border border-border/50 hover:border-primary/50 hover:text-primary transition-colors"
                            >
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {ad.city}
                                <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                            {ad.title}
                        </h1>

                        {/* Rating Display */}
                        <div className="flex items-center gap-3 py-3 border-y border-border/50 mb-6">
                            <div className="flex items-center gap-1">
                                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ({totalRatings} {t("adDetail.reviews", "reviews")})
                            </span>

                            <div className="w-px h-6 bg-border mx-2"></div>

                            {/* View Count */}
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                <span>{(ad.views || 0).toLocaleString()} views</span>
                            </div>

                            <div className="w-px h-6 bg-border mx-2"></div>

                            {/* Interactive Rating UI */}
                            <div className="flex items-center gap-1">
                                {!isAuthenticated ? (
                                    <button
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        Login to rate
                                    </button>
                                ) : userRating > 0 ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block">Your rating:</span>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "w-5 h-5",
                                                    userRating >= star ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-muted-foreground"
                                                )}
                                            />
                                        ))}
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium ml-1">Rated!</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block">
                                            {t("adDetail.rateThisAd", "Rate:")}
                                        </span>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                disabled={isRating}
                                                onClick={() => handleRate(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none disabled:opacity-50 transition-transform hover:scale-125 hover:z-10"
                                                title={t("adDetail.rate", "Rate {{star}} stars", { star })}
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-5 h-5 transition-colors cursor-pointer",
                                                        hoverRating >= star
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-transparent text-muted-foreground hover:text-yellow-400"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-8">
                            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {ad.description}
                            </p>
                        </div>

                        <div className="mt-auto flex flex-col gap-6">
                            <div className="flex flex-wrap items-center gap-4 text-foreground font-medium bg-secondary/30 p-4 rounded-xl border border-secondary">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>{t("adCard.validUntil", "Valid Until")} {new Date(ad.validUntil).toLocaleDateString()}</span>
                                </div>
                                {isExpiringSoon && (
                                    <Badge variant="destructive" className="animate-pulse text-sm py-1 px-3 flex items-center gap-1.5 shadow-sm border border-red-500/50">
                                        <Clock className="w-4 h-4" />
                                        {t("adCard.expiringSoon", "Expiring Soon!")}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {ad.keywords.map((keyword) => (
                                    <Badge
                                        key={keyword}
                                        variant="outline"
                                        className="flex items-center gap-1.5 px-3 py-1.5"
                                    >
                                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Location Map View */}
                        {ad.location && (
                            <div className="mt-8 border-t border-border/50 pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Exact Location
                                    </h3>
                                    <a
                                        href={`https://maps.google.com/?q=${ad.location.lat},${ad.location.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Open in Maps
                                    </a>
                                </div>
                                <div className="h-[250px] w-full rounded-xl overflow-hidden shadow-sm">
                                    <MapPicker value={ad.location} onChange={() => { }} readonly={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
