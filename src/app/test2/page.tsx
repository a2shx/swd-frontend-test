"use client";
import FormComponent from "../components/FormComponent";
import styles from "./test2.module.css";
import AppWrapper from "../components/AddWrapper";
import TableComponent from "../components/TableComponent";
import { useState } from "react";

export default function Test2() {

  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Form & Table</h1>
      <AppWrapper>
      <FormComponent 
      setFormSubmitted={setFormSubmitted}
      editingId={editingId} 
      setEditingId={setEditingId}  />
      <TableComponent 
        formSubmitted={formSubmitted} 
        setFormSubmitted={setFormSubmitted} 
        editingId={editingId}
        setEditingId={setEditingId} 
      />
      </AppWrapper>
    </div>
  );
}
