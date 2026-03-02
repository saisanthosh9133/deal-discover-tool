import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Search, Filter, X, Megaphone, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import NavBar from "@/components/NavBar";
import LocationSearch from "@/components/LocationSearch";
import { AdCard } from "@/components/AdCard";
import { AdCardSkeleton } from "@/components/Skeletons";
import { popularKeywords } from "@/data/mockAds";
import { useAds } from "@/context/AdsContext";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { ads, loading } = useAds();
  const { isAuthenticated } = useAuth();
  const [city, setCity] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

    return ads.filter((ad) => {
      const cityMatch = !city || ad.city.toLowerCase() === city.toLowerCase();
      const keywordMatch =
        selectedKeywords.length === 0 ||
        selectedKeywords.some((kw) =>
          ad.keywords.some((adKw) => adKw.toLowerCase().includes(kw))
        );
      return cityMatch && keywordMatch;
    });
  }, [city, selectedKeywords, hasSearched, ads]);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const clearFilters = () => {
    setCity("");
    setSelectedKeywords([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Bar */}
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex-1">
        {/* Background decoration */}
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
                Discover <span className="text-primary">Amazing Offers</span> Near You
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find the best deals and discounts from local businesses in your city
              </p>
            </motion.div>
          </div>

          {/* Search Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="shadow-card mb-8 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <LocationSearch
                    value={city}
                    onChange={setCity}
                    placeholder="Search your city..."
                    label="Location"
                  />
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Filter className="w-4 h-4 text-primary" />
                      Keywords
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., food, fitness..."
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
                        Add
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
                  <span className="text-sm text-muted-foreground">Quick filters: </span>
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
                    Search Offers
                  </Button>
                  {hasSearched && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {filteredAds.length} {filteredAds.length === 1 ? "Offer" : "Offers"} Found
                </h2>
                {(city || selectedKeywords.length > 0) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {city && (
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        {city}
                      </Badge>
                    )}
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
                      No offers found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Try adjusting your filters or search in a different city.
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
                  <h3 className="font-semibold text-foreground mb-1">Local Deals</h3>
                  <p className="text-sm text-muted-foreground">Offers from businesses near you</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Save Money</h3>
                  <p className="text-sm text-muted-foreground">Exclusive discounts & offers</p>
                </div>
                <div className="group">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Best Deals</h3>
                  <p className="text-sm text-muted-foreground">Curated offers just for you</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer with Promote CTA */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground mt-2">
                © 2026 DealDiscover. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center md:text-right">
                <p className="font-semibold text-foreground">Have a business?</p>
                <p className="text-sm text-muted-foreground">Reach thousands of customers</p>
              </div>
              <Link to="/promote">
                <Button className="gap-2 shadow-card">
                  <Megaphone className="w-4 h-4" />
                  Promote My Ad
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
