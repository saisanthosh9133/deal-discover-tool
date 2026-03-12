import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Search, Filter, X, Megaphone, Sparkles, TrendingUp, Users, History, ArrowUpDown, LocateFixed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/ui/Logo";
import NavBar from "@/components/NavBar";
import LocationSearch from "@/components/LocationSearch";
import { AdCard } from "@/components/AdCard";
import { AdCardSkeleton } from "@/components/Skeletons";
import { popularKeywords } from "@/data/mockAds";
import { useAds } from "@/context/AdsContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type SortBy = "newest" | "highest_rated" | "expiring_soon" | "most_viewed";

const RECENT_SEARCHES_KEY = "dd_recent_searches";
const MAX_RECENT = 5;

interface RecentSearch {
  city: string;
  keywords: string[];
}

export default function Index() {
  const { ads, loading } = useAds();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [isLocatingNearMe, setIsLocatingNearMe] = useState(false);

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const saveSearch = (searchCity: string, searchKeywords: string[]) => {
    if (!searchCity && searchKeywords.length === 0) return;
    const newEntry: RecentSearch = { city: searchCity, keywords: [...searchKeywords] };
    setRecentSearches((prev) => {
      const deduped = prev.filter(
        (s) =>
          !(
            s.city === newEntry.city &&
            JSON.stringify(s.keywords) === JSON.stringify(newEntry.keywords)
          )
      );
      const updated = [newEntry, ...deduped].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const applyRecentSearch = (search: RecentSearch) => {
    setCity(search.city);
    setSelectedKeywords(search.keywords);
    setHasSearched(true);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  // Set page title
  useEffect(() => {
    document.title = "DealDiscover — Discover Amazing Offers Near You";
    return () => { document.title = "DealDiscover"; };
  }, []);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in your browser");
      return;
    }
    setIsLocatingNearMe(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          if (detectedCity) {
            setCity(detectedCity);
            setHasSearched(true);
            saveSearch(detectedCity, selectedKeywords);
          } else {
            toast.error("Could not detect your city. Please select manually.");
          }
        } catch {
          toast.error("Could not detect your location.");
        } finally {
          setIsLocatingNearMe(false);
        }
      },
      (err) => {
        setIsLocatingNearMe(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Enable it in browser settings.");
        } else {
          toast.error("Could not get your location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      setSelectedKeywords((prev) => [...prev, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const filteredAds = useMemo(() => {
    if (!hasSearched) return [];

    const filtered = ads.filter((ad) => {
      const cityMatch = !city || ad.city.toLowerCase() === city.toLowerCase();
      const keywordMatch =
        selectedKeywords.length === 0 ||
        selectedKeywords.some((kw) =>
          ad.keywords.some((adKw) => adKw.toLowerCase().includes(kw))
        );
      return cityMatch && keywordMatch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "highest_rated":
          return (b.avgRating || 0) - (a.avgRating || 0);
        case "expiring_soon": {
          const aDate = a.validUntil ? new Date(a.validUntil).getTime() : Infinity;
          const bDate = b.validUntil ? new Date(b.validUntil).getTime() : Infinity;
          return aDate - bDate;
        }
        case "most_viewed":
          return (b.views || 0) - (a.views || 0);
        case "newest":
        default:
          return b.id.localeCompare(a.id);
      }
    });
  }, [city, selectedKeywords, hasSearched, ads, sortBy]);

  const handleSearch = () => {
    setHasSearched(true);
    saveSearch(city, selectedKeywords);
  };

  const clearFilters = () => {
    setCity("");
    setSelectedKeywords([]);
    setHasSearched(false);
  };

  const sortLabel: Record<SortBy, string> = {
    newest: "Newest First",
    highest_rated: "Highest Rated",
    expiring_soon: "Expiring Soon",
    most_viewed: "Most Viewed",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex-1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Main Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {t("home.heroTitle", {
                  defaultValue: "Discover <1>Amazing Offers</1> Near You",
                }).split("<1>")[0]}
                <span className="text-primary">
                  {t("home.heroTitle").includes("<1>")
                    ? t("home.heroTitle").split("<1>")[1]?.split("</1>")[0]
                    : "Amazing Offers"}
                </span>
                {t("home.heroTitle").includes("</1>")
                  ? t("home.heroTitle").split("</1>")[1]
                  : ""}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("home.heroSubtitle")}
              </p>
            </motion.div>
          </div>

          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="shadow-card mb-4 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <LocationSearch
                    value={city}
                    onChange={setCity}
                    placeholder={t("home.locationPlaceholder")}
                    label={t("home.locationLabel")}
                  />
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Filter className="w-4 h-4 text-primary" />
                      {t("home.keywordsLabel")}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("home.keywordsPlaceholder")}
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addKeyword(keywordInput);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => addKeyword(keywordInput)}
                      >
                        {t("home.addKeyword")}
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="gap-1.5 py-1.5 px-3">
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">{t("home.quickFilters")} </span>
                  {popularKeywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => addKeyword(kw)}
                      disabled={selectedKeywords.includes(kw)}
                      className="text-sm text-primary hover:underline mr-3 disabled:text-muted-foreground disabled:no-underline"
                    >
                      +{kw}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSearch} className="flex-1 gap-2 shadow-elevated">
                    <Search className="w-5 h-5" />
                    {t("home.searchButton")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNearMe}
                    disabled={isLocatingNearMe}
                    className="gap-2 shrink-0"
                  >
                    {isLocatingNearMe ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LocateFixed className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Near Me</span>
                  </Button>
                  {hasSearched && (
                    <Button variant="outline" onClick={clearFilters}>
                      {t("home.clearButton")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            {!hasSearched && recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl mx-auto mb-6 px-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    Recent searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => {
                    const label = [
                      search.city,
                      ...search.keywords,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <button
                        key={index}
                        onClick={() => applyRecentSearch(search)}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-border bg-card hover:bg-secondary hover:border-primary/40 transition-colors text-foreground"
                      >
                        <History className="w-3 h-3 text-muted-foreground shrink-0" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {t("home.offersFound", { count: filteredAds.length })}
                  {(city || selectedKeywords.length > 0) && (
                    <span className="ml-2 inline-flex items-center gap-1.5">
                      {city && (
                        <Badge variant="outline" className="gap-1 font-normal text-sm">
                          <MapPin className="w-3 h-3" />
                          {city}
                        </Badge>
                      )}
                    </span>
                  )}
                </h2>

                {/* Sort Dropdown */}
                {filteredAds.length > 1 && (
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                      <SelectTrigger className="w-44 h-9 text-sm">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="highest_rated">Highest Rated</SelectItem>
                        <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                        <SelectItem value="most_viewed">Most Viewed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <AdCardSkeleton key={`skeleton-${i}`} />
                    ))}
                  </div>
                ) : filteredAds.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAds.map((ad, index) => (
                      <AdCard key={ad.id} ad={ad} index={index} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {t("home.noOffersTitle")}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t("home.noOffersDesc")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="max-w-4xl mx-auto mt-8"
            >
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="group">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t("home.localDealsTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("home.localDealsDesc")}</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t("home.saveMoneyTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("home.saveMoneyDesc")}</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{t("home.bestDealsTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("home.bestDealsDesc")}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground mt-2">
                {t("home.footerCopyright")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center md:text-right">
                <p className="font-semibold text-foreground">{t("home.footerBusinessTitle")}</p>
                <p className="text-sm text-muted-foreground">{t("home.footerBusinessDesc")}</p>
              </div>
              <Link to="/promote">
                <Button className="gap-2 shadow-card">
                  <Megaphone className="w-4 h-4" />
                  {t("home.footerCTA")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
