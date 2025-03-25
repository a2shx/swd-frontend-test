import FormComponent from "../components/FormComponent";
import styles from "./test2.module.css";
import AppWrapper from "../components/AddWrapper";

export default function Test2() {

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Form & Table</h1>
      <AppWrapper>
      <FormComponent/>
      </AppWrapper>
    </div>
  );
}
