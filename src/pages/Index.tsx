import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Search, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Logo size="lg" />
            </motion.div>
          </header>

          {/* Main Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Discover Deals.
                <br />
                <span className="text-primary">Promote Offers.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Connect with local businesses and find exclusive offers in your city. 
                Or promote your own deals to reach thousands of potential customers.
              </p>
            </motion.div>

            {/* Main Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link to="/promote" className="block">
                  <Card className="group h-full border-2 border-border hover:border-primary bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                    <CardContent className="p-8 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Megaphone className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          Promote My Ad
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Upload your offers with images, add keywords, and reach customers in your city.
                        </p>
                        <Button className="w-full group-hover:animate-pulse-glow">
                          Start Promoting
                          <Zap className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link to="/search" className="block">
                  <Card className="group h-full border-2 border-border hover:border-primary bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                    <CardContent className="p-8 relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Search className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          Search Offers
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Find amazing deals near you by selecting your location and interests.
                        </p>
                        <Button variant="secondary" className="w-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                          Find Deals
                          <Sparkles className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Local Reach</h3>
                <p className="text-sm text-muted-foreground">Connect with customers in your city</p>
              </div>
              <div className="group">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Grow Business</h3>
                <p className="text-sm text-muted-foreground">Increase visibility & sales</p>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground mt-4">
            © 2025 BENIFIT ME. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
