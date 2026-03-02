import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Tag,
    Megaphone,
    Trash2,
    Eye,
    Plus,
    User as UserIcon,
    Mail,
    Shield,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/Logo";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import api from "@/context/AuthContext";
import { toast } from "sonner";

interface UserAd {
    id: string;
    _id?: string;
    title: string;
    description: string;
    imageUrl: string;
    keywords: string[];
    city: string;
    discount: string;
    businessName: string;
    validUntil: string;
    isActive: boolean;
    views: number;
    createdAt: string;
}

export default function Profile() {
    const { user } = useAuth();
    const [myAds, setMyAds] = useState<UserAd[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        try {
            setLoading(true);
            const response = await api.get("/ads/user/mine");
            if (response.data.success) {
                setMyAds(response.data.ads);
            }
        } catch (err) {
            console.warn("Could not fetch ads:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAd = async (adId: string) => {
        try {
            const response = await api.delete(`/ads/${adId}`);
            if (response.data.success) {
                setMyAds((prev) => prev.filter((ad) => (ad.id || ad._id) !== adId));
                toast.success("Ad removed successfully");
            }
        } catch (err) {
            toast.error("Failed to delete ad");
        }
    };

    const activeAds = myAds.filter((ad) => ad.isActive);
    const totalViews = myAds.reduce((sum, ad) => sum + (ad.views || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="border-border/50 bg-card shadow-card mb-8 overflow-hidden">
                        {/* Gradient banner */}
                        <div className="h-32 bg-gradient-to-r from-primary/80 via-accent to-primary/60 relative">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
                        </div>

                        <CardContent className="relative px-6 pb-6">
                            {/* Avatar */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                                <div className="w-24 h-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-elevated border-4 border-card">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="flex-1 mb-1">
                                    <h1 className="text-2xl font-bold text-foreground">{user?.name || "User"}</h1>
                                    <div className="flex items-center gap-4 mt-1 text-muted-foreground text-sm">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5" />
                                            {user?.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Shield className="w-3.5 h-3.5" />
                                            {user?.role === "ADMIN" ? "Admin" : "Member"}
                                        </span>
                                    </div>
                                </div>
                                <Link to="/promote">
                                    <Button size="sm" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        New Deal
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">{myAds.length}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Total Ads</div>
                                </div>
                                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">{activeAds.length}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Active</div>
                                </div>
                                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">{totalViews}</div>
                                    <div className="text-xs text-muted-foreground mt-1">Total Views</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* My Ads Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-primary" />
                            My Deals
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : myAds.length === 0 ? (
                        <Card className="border-dashed border-2 border-border">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                                    <Megaphone className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">No deals yet</h3>
                                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                                    Start promoting your business deals and reach customers in your city.
                                </p>
                                <Link to="/promote">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Your First Deal
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {myAds.map((ad, index) => (
                                <motion.div
                                    key={ad.id || ad._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className={`border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-card ${!ad.isActive ? "opacity-60" : ""}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                {/* Image */}
                                                {ad.imageUrl && (
                                                    <img
                                                        src={ad.imageUrl}
                                                        alt={ad.title}
                                                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = "none";
                                                        }}
                                                    />
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h3 className="font-semibold text-foreground truncate">{ad.title}</h3>
                                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {ad.city}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Eye className="w-3 h-3" />
                                                                    {ad.views || 0} views
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    Until {new Date(ad.validUntil).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <Badge
                                                                variant={ad.isActive ? "default" : "secondary"}
                                                                className="text-xs"
                                                            >
                                                                {ad.isActive ? ad.discount : "Inactive"}
                                                            </Badge>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleDeleteAd(ad.id || ad._id!)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Keywords */}
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {ad.keywords.slice(0, 4).map((keyword) => (
                                                            <span
                                                                key={keyword}
                                                                className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary/70 px-2 py-0.5 rounded-full"
                                                            >
                                                                <Tag className="w-2.5 h-2.5" />
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
