import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",

    resources: {
      en: {
        translation: {
          hero_title: "Unlimited Edits, Creativity & More",
          signin: "Sign In",
          title: "renderFlash",
          tagline_1: "Create. Share. Discover.",
          tagline_2: "A community built for creative minds.",
        },
      },

      hi: {
        translation: {
          hero_title: "अनलिमिटेड एडिट्स, क्रिएटिविटी और बहुत कुछ",
          signin: "साइन इन",
          title: "रेंडरफ्लैश",
        },
      },

      ml: {
        translation: {
          hero_title: "അൺലിമിറ്റഡ് എഡിറ്റ്സ്, ക്രീയേറ്റിവിറ്റി & മോർ",
          signin: "സൈൻ ഇൻ",
        },
      },
      ar: {
        translation: {
          hero_title: "تعديلات غير محدودة، إبداع وأكثر",
          signin: "تسجيل الدخول",
          title: "رندرفلاش",
          tagline_1: "أبدِع. شارِك. اكتشِف",
          tagline_2: "مجتمعٌ صُمِّمَ للعقول المبدعة",
        },
      },
      jn: {
        translation: {
          hero_title: "無制限の編集、創造性など",
          signin: "サインイン",
        },
      },
      tl: {
        translation: {
          hero_title: "வரம்பற்ற திருத்தங்கள், படைப்பாற்றல் மற்றும் பல",
          signin: "உள்நுழைக",
        },
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
