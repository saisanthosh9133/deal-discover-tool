import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Search, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/ui/Logo";
import { AdCard } from "@/components/AdCard";
import { mockAds, cities, popularKeywords } from "@/data/mockAds";

export default function SearchOffers() {
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
    
    return mockAds.filter((ad) => {
      const cityMatch = !city || ad.city.toLowerCase() === city.toLowerCase();
      const keywordMatch =
        selectedKeywords.length === 0 ||
        selectedKeywords.some((kw) =>
          ad.keywords.some((adKw) => adKw.toLowerCase().includes(kw))
        );
      return cityMatch && keywordMatch;
    });
  }, [city, selectedKeywords, hasSearched]);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const clearFilters = () => {
    setCity("");
    setSelectedKeywords([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Discover <span className="text-primary">Amazing Offers</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Find the best deals near you
            </p>
          </div>

          {/* Search Filters */}
          <Card className="shadow-card mb-8 max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

          {/* Results */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
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
                {filteredAds.length > 0 ? (
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
                      Try adjusting your filters or search in a different city to find more offers.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Ready to discover?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select your city and add keywords to find the best offers near you.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
