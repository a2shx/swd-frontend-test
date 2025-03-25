import FormComponent from "../components/FormComponent";
import styles from "./test2.module.css";
import AppWrapper from "../components/AddWrapper";
import TableComponent from "../components/TableComponent";
import LoadFormData from "../components/LoadFormData";


export default function Test2() {

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Form & Table</h1>
      <AppWrapper>
      <FormComponent/>
      <LoadFormData/>
      <TableComponent/>
      </AppWrapper>
    </div>
  );
}
