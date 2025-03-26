"use client";

import { Select } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "@/app/i18n";

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const handleChangeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.language || "en"}
      style={{ width: 120 }}
      onChange={handleChangeLanguage}
      options={[
        { value: "en", label: t("EN") },
        { value: "th", label: t("TH") }
      ]}
    />
  );
};

export default LanguageSwitcher;
