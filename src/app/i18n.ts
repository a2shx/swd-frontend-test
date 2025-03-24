import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { "changeLang": "Change Language", "moveShape": "Move Shape", "switchGrid": "Switch Grid" } },
    th: { translation: { "changeLang": "เปลี่ยนภาษา", "moveShape": "ย้ายรูปร่าง", "switchGrid": "สลับกริด" } }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
