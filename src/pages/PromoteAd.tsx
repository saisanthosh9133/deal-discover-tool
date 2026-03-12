import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, MapPin, Tag, Image as ImageIcon, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import LocationSearch from "@/components/LocationSearch";
import { MapPicker } from "@/components/MapPicker";
import { popularKeywords } from "@/data/mockAds";
import { useAds } from "@/context/AdsContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function PromoteAd() {
  const navigate = useNavigate();
  const { addAd } = useAds();
  const { t } = useTranslation();
  const [images, setImages] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [businessName, setBusinessName] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 10) {
      setKeywords((prev) => [...prev, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || keywords.length === 0) {
      toast.error(t("promote.errorRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      await addAd({
        title,
        description: description || title,
        imageUrl: images[0] || "",
        keywords,
        city,
        location: location || undefined,
        discount: discount || "SPECIAL OFFER",
        businessName: businessName || "Local Business",
        validUntil: validUntil.toISOString().split("T")[0],
      });

      toast.success(t("promote.successTitle"), {
        description: t("promote.successDesc"),
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("promote.errorRequired");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("promote.backToHome")}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("promote.title").split("<1>")[0]}
              <span className="text-primary">
                {t("promote.title").includes("<1>")
                  ? t("promote.title").split("<1>")[1]?.split("</1>")[0]
                  : "Offer"}
              </span>
              {t("promote.title").includes("</1>")
                ? t("promote.title").split("</1>")[1]
                : ""}
            </h1>
            <p className="text-muted-foreground text-lg">{t("promote.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Images */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  {t("promote.uploadImages")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  {images.length < 4 && (
                    <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">{t("promote.addPhoto")}</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{t("promote.uploadHint")}</p>
              </CardContent>
            </Card>

            {/* Offer Details */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  {t("promote.offerDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t("promote.offerTitle")}</Label>
                  <Input id="title" placeholder={t("promote.offerTitlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="description">{t("promote.description")}</Label>
                  <Textarea id="description" placeholder={t("promote.descriptionPlaceholder")} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 min-h-[100px]" />
                </div>
                <div>
                  <Label htmlFor="discount">{t("promote.discount")}</Label>
                  <Input id="discount" placeholder={t("promote.discountPlaceholder")} value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="businessName">{t("promote.businessName")}</Label>
                  <Input id="businessName" placeholder={t("promote.businessNamePlaceholder")} value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* Location & Keywords */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {t("promote.locationAndKeywords")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocationSearch value={city} onChange={setCity} placeholder={t("home.locationPlaceholder")} label={t("promote.cityLabel")} />

                <div className="pt-2 pb-2">
                  <Label className="mb-2 block">Pinpoint Exact Location (Optional)</Label>
                  <MapPicker value={location} onChange={setLocation} />
                </div>

                <div>
                  <Label>{t("promote.keywordsLabel")}</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      placeholder={t("promote.keywordsPlaceholder")}
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword(keywordInput);
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={() => addKeyword(keywordInput)}>
                      {t("promote.addKeyword")}
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="gap-1.5 py-1.5 px-3">
                          {keyword}
                          <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <span className="text-sm text-muted-foreground">{t("promote.popular")} </span>
                    {popularKeywords.slice(0, 6).map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => addKeyword(kw)}
                        disabled={keywords.includes(kw)}
                        className="text-sm text-primary hover:underline mr-2 disabled:text-muted-foreground disabled:no-underline"
                      >
                        +{kw}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full gap-2 shadow-elevated" disabled={isSubmitting}>
              <Check className="w-5 h-5" />
              {t("promote.submitButton")}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
