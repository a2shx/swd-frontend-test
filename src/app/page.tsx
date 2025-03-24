import { Button } from 'antd';
import Link from 'next/link';
import styles from './page.module.css'; // your CSS file for page styles

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <Link href="/test1">
            <Button className={styles.customButton} type="primary">
              <span className={`${styles.breakText} ${styles.testTitle}`}>Test 1</span>
              <span className={styles.breakText}>Layout & Style</span>
            </Button>
          </Link>

          <Link href="/test2">
            <Button className={styles.customButton} type="primary">
              <span className={`${styles.breakText} ${styles.testTitle}`}>Test 2</span>
              <span className={styles.breakText}>Form & Table</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
