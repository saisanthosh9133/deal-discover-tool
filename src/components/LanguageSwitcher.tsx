import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LANGUAGES = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिंदी" },
    { code: "te", label: "తెలుగు" },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.split("-")[0] || "en";

    const handleChange = (code: string) => {
        i18n.changeLanguage(code);
    };

    return (
        <div className="flex items-center gap-1 bg-secondary/60 rounded-full px-1.5 py-0.5">
            <Globe className="w-3.5 h-3.5 text-muted-foreground mr-0.5 hidden sm:block" />
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => handleChange(lang.code)}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-200 ${currentLang === lang.code
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                    aria-label={`Switch to ${lang.label}`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
