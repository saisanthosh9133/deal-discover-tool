import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t("register.errors.allRequired"));
      return false;
    }

    if (password.length < 6) {
      setError(t("register.errors.passwordLength"));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t("register.errors.passwordMatch"));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("register.errors.invalidEmail"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("register.errors.failed");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { level: 0, text: "", color: "" };
    if (password.length < 6) return { level: 1, text: t("register.strength.weak"), color: "text-red-600" };
    if (password.length < 10) return { level: 2, text: t("register.strength.fair"), color: "text-yellow-600" };
    return { level: 3, text: t("register.strength.strong"), color: "text-green-600" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          <CardTitle className="text-2xl font-bold">{t("register.createAccount")}</CardTitle>
          <CardDescription>{t("register.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("register.fullName")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("register.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("register.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("register.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("register.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              {password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${strength.level === 1
                          ? "w-1/3 bg-red-500"
                          : strength.level === 2
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-green-500"
                        }`}
                    />
                  </div>
                  {strength.text && (
                    <span className={`text-xs font-semibold ${strength.color}`}>
                      {strength.text}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              {confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("register.passwordsMatch")}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("register.creating")}
                </>
              ) : (
                t("register.createBtn")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("register.haveAccount")}{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
              {t("register.signIn")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
