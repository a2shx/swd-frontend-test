"use client";
import { Button } from 'antd';
import Link from 'next/link';
import styles from './page.module.css'; // your CSS file for page styles
import LanguageSwitcher from './components/SwitchLanguage';
import AppWrapper from './components/AddWrapper';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
        <LanguageSwitcher/>
      <main className={styles.main}>
        <div>
          <Link href="/test1">
            <Button className={styles.customButton} type="primary">
              <span className={`${styles.breakText} ${styles.testTitle}`}>{t("Test 1")}</span>
              <span className={styles.breakText}>{t("Layout & Style")}</span>
            </Button>
          </Link>

          <Link href="/test2">
            <Button className={styles.customButton} type="primary">
              <span className={`${styles.breakText} ${styles.testTitle}`}>{t("Test 2")}</span>
              <span className={styles.breakText}>{t("Form & Table")}</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
