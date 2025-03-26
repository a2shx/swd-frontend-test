"use client";
import { useState } from "react";
import { Row, Col, Button } from "antd";
import styles from "./test1.module.css";
import LanguageSwitcher from "../components/SwitchLanguage";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const initialShapes = [
  "square", "circle", "oval",
  "parallelogram", "rectangle", "trapezoid"
];

export default function Test1() {
  const [shapes, setShapes] = useState(initialShapes);
  const { t } = useTranslation();
/*
  ========================================================================
                            SHAPE MOVEMENT
  ========================================================================
*/
  const shiftLeft = () => {
    setShapes((prev) => [...prev.slice(1), prev[0]]);
  };

  const shiftRight = () => {
    setShapes((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  };

  const swapRows = () => {
    setShapes((prev) => [...prev.slice(3), ...prev.slice(0, 3)]);
  };

  const shuffleShapes = () => {
    let shuffled = [...shapes];
    do {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
    } while (shuffled.every((shape, index) => shape === shapes[index]));
    setShapes(shuffled);
  };
/*
  ========================================================================
                                JSX PART
  ========================================================================
*/
  return (
    <div className={styles.page}>
      
      <h1 className={styles.title}>{t("Layout & Style")}</h1>
      <div className={styles.topButton}>
        <LanguageSwitcher/>
        <Link href="/">
            <Button className={styles.navButton}>
              {t("Home")}
            </Button>
          </Link>
      </div>
      <Row justify="center" className={styles.row1}>
        <Col>
          <Button className={styles.controlButton} onClick={shiftLeft}>
            <div className={styles.triangleLeft}></div>
            <span className={styles.spanLabel}>Move Shape</span>
          </Button>
        </Col>
        <Col>
        <Button className={styles.controlButtonMiddle} onClick={swapRows}>
            <div className={styles.triangleContainer}>
              <div className={styles.triangleUp}></div>
              <div className={styles.triangleDown}></div>
            </div>
            <span className={styles.spanLabel}>{t("Move Position")}</span>
          </Button>
        </Col>
        <Col>
          <Button className={styles.controlButton} onClick={shiftRight}>
            <div className={styles.triangleRight}></div>
            <span className={styles.spanLabel}>{t("Move Shape")}</span>
          </Button>
        </Col>
      </Row>

      <Row className={styles.row2}>
        {shapes.slice(0, 3).map((shape, index) => (
          <Col key={index}>
            <Button className={styles.shapeButton1} onClick={shuffleShapes}>
              <div className={styles[shape]}></div>
            </Button>
          </Col>
        ))}
      </Row>

      <Row className={styles.row3}>
        {shapes.slice(3, 6).map((shape, index) => (
          <Col key={index}>
            <Button className={styles.shapeButton2} onClick={shuffleShapes}>
              <div className={styles[shape]}></div>
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
}