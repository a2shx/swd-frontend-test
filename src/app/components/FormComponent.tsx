"use client";

import React from 'react';  // Add this import
import { useDispatch, useSelector } from "react-redux";
import { updateFormData, resetFormData, setErrors } from "../redux/formSlice";
import { RootState } from "../redux/store";
import { Input, Select, DatePicker, Radio, Button, message } from "antd";
import { FormState } from '../redux/formSlice';
import LanguageSwitcher from './SwitchLanguage';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import styles from "./component.module.css";
import Link from 'next/link';

const { Option } = Select;

interface FormComponentProps {
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const FormComponent: React.FC<FormComponentProps> = ({ setFormSubmitted, editingId, setEditingId }) => {  
  const dispatch = useDispatch();
  const formValues = useSelector((state: RootState) => state.form);
  const errors = useSelector((state: RootState) => state.form.errors);
  const { t } = useTranslation();
 /*
  ========================================================================
                      VALIDATION OF EACH FIELD PART
  ========================================================================
  */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate each field individually but stop on the first error
    if (!formValues.title || formValues.title === '') {
      newErrors.title = t("Title is required!");
    } if (!formValues.firstName || formValues.firstName === '') {
      newErrors.firstName = t("First Name is required!");
    } else if (!/^[A-Za-z\u0E00-\u0E7F\s]+$/.test(formValues.firstName)) {
      newErrors.firstName = t("Firstname can't contain number or special letter!");
    } if (!formValues.lastName || formValues.lastName === '') {
      newErrors.lastName = t("Last Name is required!");
    } else if (!/^[A-Za-z\u0E00-\u0E7F\s]+$/.test(formValues.lastName)) {
      newErrors.lastName = t("Lastname can't contain number or special letter!");
    } if (!formValues.birthday) {
      newErrors.birthday = t("Birthday is required!");
    } if (!formValues.nationality || formValues.nationality === '') {
      newErrors.nationality = t("Nationality is required!");
    } if (!formValues.gender || formValues.gender === '') {
      newErrors.gender = t("Gender is required!");
    } if (!formValues.phoneNumber || formValues.phoneNumber === '') {
      newErrors.phoneNumber = t("Phone Number is required!");
    } if (!/^\d+$/.test(formValues.phoneNumber)) {
      newErrors.phoneNumber = t("Phone Number must be a valid number!");
    } if (!formValues.expectedSalary || formValues.expectedSalary === '') {
      newErrors.expectedSalary = t("Expected Salary is required!");
    }

    // Citizen ID validation (must be exactly 13 digits and a number)
    const citizenId = formValues.citizenId.join("");
    if (citizenId && citizenId.length !== 13) {
      newErrors.citizenId = t("Citizen ID must be exactly 13 digits!");
    } else if (!/^\d+$/.test(citizenId)) {
      newErrors.citizenId = t("Citizen ID must be a valid number!");
    }

    dispatch(setErrors(newErrors)); // Dispatch errors to Redux

    return Object.keys(newErrors).length === 0;
  };
 /*
  ========================================================================
            HANDLE SUBMIT BUTTON (BOTH ADD NEW AND EDIT SUBMIT)
  ========================================================================
  */
  const handleSubmit = () => {
    if (!validateForm()) {
      return; // If validation fails, don't submit
    }
  
    const formDataToSubmit: FormState = { ...formValues };
    const cleanedFormDataToSubmit = {
      ...formDataToSubmit,
      errors: {},
    };
  
    const uniqueKey = cleanedFormDataToSubmit.citizenId.join(""); // Join the citizenId array if it's an array
    const previousData: FormState[] = JSON.parse(localStorage.getItem("submittedForms") || "[]");
  
    if (editingId) {
      const updatedData = previousData.map((data: FormState) => {
        if (data.citizenId.join("") === editingId) {
          return { ...data, ...cleanedFormDataToSubmit };
        }
        return data;
      });
  
      localStorage.setItem("submittedForms", JSON.stringify(updatedData)); // Update data in localStorage
      message.success("Changes saved successfully!");
  
      // After updating, reset editingId (clear it to prevent always staying in edit mode)
      dispatch(resetFormData());
      setFormSubmitted(true);
      setEditingId(null); // Reset editingId to null
      alert("Save Success");
    } else {
      // Check for duplicates when submitting a new record
      const isDuplicate = previousData.some(
        (data: FormState) => data.citizenId.join("") === uniqueKey
      );
  
      if (isDuplicate) {
        message.warning("This data has already been submitted!");
        return; // Prevent submission
      }
  
      // If not a duplicate, proceed with adding new data
      previousData.push(cleanedFormDataToSubmit); // Add new data to the stored data
      localStorage.setItem("submittedForms", JSON.stringify(previousData));
  
      setFormSubmitted(true);
      console.log("Form data submitted:", cleanedFormDataToSubmit);
  
      // Reset form after successful submission
      dispatch(resetFormData());
      alert("Save Success");
    }
  };
 /*
  ========================================================================
              HANDLE CHANGE OF BIRTHDAY INPUT FIELD
  ========================================================================
  */
const handleChange = (field: keyof FormState, value: string | string[] | Date | null) => {
  // Special handling for 'birthday' field to convert Date to string
  if (field === 'birthday' && value instanceof Date) {
    value = value.toISOString(); // Convert Date object to ISO string
  }

  // Handle the dispatch for the form data update
  dispatch(updateFormData({ field, value }));
};
  
 /*
  ========================================================================
              HANDLE UPDATE DATA ON LOCAL STORAGE PART
  ========================================================================
  */
    React.useEffect(() => {
    if (editingId) {
      const savedData = JSON.parse(localStorage.getItem("submittedForms") || "[]");
      const dataToEdit = savedData.find((item: FormState) => item.citizenId.join("") === editingId);
      console.log('this from useEffect', editingId)
      console.log('dataToEdit:', dataToEdit); // Add this log to check if the data is correct

      if (dataToEdit) {
        Object.keys(dataToEdit).forEach((field) => {
          const value = dataToEdit[field as keyof typeof dataToEdit];
          dispatch(updateFormData({ field: field as keyof FormState, value }));
        });
      }
    } else {
      dispatch(resetFormData()); // Reset form when no `editingId` is present
    }
  }, [editingId, dispatch]);

  /*
  ========================================================================
                                JSX PART
  ========================================================================
  */
  return (
    <div className={styles.formStyle}>
      <div className={styles.topButton}>
        <LanguageSwitcher/>
        <Link href="/">
              <Button className={styles.navButton}>
                {t("Home")}
              </Button>
        </Link>
      </div>



      <div className={styles.firstRow}>
        {/* 
        ===================================================================
                            TITLE INPUT FIELD
        ===================================================================
        */}
        <div className={styles.set1}>
          <label><span className={styles.redFont}>*</span> {t("Title")}:</label>
          <div className={styles.field}>
            <Select
              value={formValues.title === "" ? undefined : formValues.title}  // Ensures placeholder is visible if no value is selected
              placeholder={t("Title" )}     
              onChange={(value) => handleChange("title", value)}
              className={styles.title}
            >
              <Option value="Mr">{t("Mr.")}</Option>
              <Option value="Mrs">{t("Mrs.")}</Option>
              <Option value="Ms">{t("Ms.")}</Option>
            </Select>
            {errors.title && <div className={styles.error}>{errors.title}</div>}
          </div>
        </div>
        {/* 
        ===================================================================
                            FIRST NAME INPUT FIELD
        ===================================================================
        */}
        <div className={styles.set2}>
          <label><span className={styles.redFont}>*</span> {t("Firstname")}:</label>
          <div className={styles.field}>
            <Input
              value={formValues.firstName}
              placeholder={t("First Name")}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={styles.firstname}
            />
            {errors.firstName && <div className={styles.error}>{errors.firstName}</div>}
          </div>
        </div>
        {/* 
        ===================================================================
                            LAST NAME INPUT FIELD
        ===================================================================
        */}
        <div className={styles.set3}>
          <label><span className={styles.redFont}>*</span> {t("Lastname")}:</label>
          <div className={styles.field}>
          <Input
            value={formValues.lastName}
            placeholder={t("Last Name")}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={styles.lastname}
          />
          {errors.lastName && <div className={styles.error}>{errors.lastName}</div>}
          </div>
        </div>
        
        </div>



      <div className={styles.secondRow}>
        {/* 
        ===================================================================
                            BIRTHDAY INPUT FIELD
        ===================================================================
        */}
        <div className={styles.set4}>
          <label><span className={styles.redFont}>*</span> {t("Birthday")}:</label>
          <div className={styles.field}>
            <DatePicker
              className={styles.birthday}
              value={formValues.birthday ? dayjs(formValues.birthday) : null} // Convert ISO string to dayjs object for display
              onChange={(date) => {
                if (date) {
                  handleChange('birthday', date.toISOString()); // Convert Date (dayjs) to ISO string on change
                }
              }}
              format="MM/DD/YY"
              placeholder={t("mm/dd/yy")} // Using translation for placeholder
            />
            {errors.birthday && <div className={styles.error}>{errors.birthday}</div>}
            </div>
        </div>
        {/* 
        ===================================================================
                            NATIONALITY INPUT FIELD
        ===================================================================
        */}
        <div className={styles.set5}>
          <label><span className={styles.redFont}>*</span> {t("Nationality")}:</label>
          <div className={styles.field}>
          <Select
            value={formValues.nationality  || undefined}
            placeholder={t("Please Select")}
            onChange={(value) => handleChange("nationality", value)}
            className={styles.nationality}
          >
            <Option value="Thai">{t("Thai")}</Option>
            <Option value="French">{t("French")}</Option>
            <Option value="American">{t("American")}</Option>
          </Select>
          {errors.nationality && <div className={styles.error}>{errors.nationality}</div>}
          </div>
        </div>
      </div>



      <div className={styles.thirdRow}>
        {/* 
        ===================================================================
                            CITIZEN ID INPUT FIELD
        ===================================================================
        */}
      <div className={styles.set6}>
        <label><span className={styles.redFont}>*</span> {t("Citizen ID")}:</label>
          <div className={styles.field}>
            <div style={{ display: "flex", gap: "5px" }}>
              {formValues.citizenId.map((_, index) => (
                <React.Fragment key={index}>
                  <Input
                    value={formValues.citizenId[index]}
                    maxLength={
                      index === 0 ? 1 :
                      index === 1 ? 4 :
                      index === 2 ? 5 :
                      index === 3 ? 2 : 1
                    }
                    placeholder={["X", "XXXX", "XXXXX", "XX", "X"][index]}
                    onChange={(e) => {
                      const newCitizenId = [...formValues.citizenId];
                      newCitizenId[index] = e.target.value;
                      handleChange("citizenId", newCitizenId);
                    }}
                    style={{
                      width: index === 0 ? "10%" :
                              index === 1 ? "20%" :
                              index === 2 ? "20%" :
                              index === 3 ? "15%" : "10%"
                    }}
                  />
                  {index < formValues.citizenId.length - 1 && (
                    <span className={styles.dashsign}> - </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            {errors.citizenId && <div className={styles.redFont}>{errors.citizenId}</div>}
          </div>
        </div>
      </div>

      <div className={styles.fourthRow}>
        {/* 
        ===================================================================
                            GENDER INPUT FIELD
        ===================================================================
        */}
      <div className={styles.set7}>
          <label><span className={styles.redFont}>*</span> {t("Gender")}:</label>
          <div className={styles.field}>
          <Radio.Group
            value={formValues.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <Radio value="Male">{t("Male")}</Radio>
            <Radio value="Female">{t("Female")}</Radio>
            <Radio value="Unisex">{t("Unisex")}</Radio>
          </Radio.Group>
          {errors.gender && <div className={styles.error}>{errors.gender}</div>}
        </div>
      </div>
    </div>


    <div className={styles.fifthRow}>
        {/* 
        ===================================================================
                            MOBILE PHONE INPUT FIELD
        ===================================================================
        */}
      <div className={styles.set8}>
        <label><span className={styles.redFont}>*</span> {t("Mobile Phone")}:</label>
          <div className={styles.field}>
          <div className={styles.phoneField}>
            <Select
              className={styles.countryCode}
              value={formValues.countryCode  || undefined}
              placeholder="+XX"
              onChange={(value) => handleChange("countryCode", value)}
            >
              <Option value="+66">
                <img src="/flags/th.png" alt="Thailand flag" className={styles.flagImage} /> +66
              </Option>
              <Option value="+1">
                <img src="/flags/us.png" alt="US flag" className={styles.flagImage} /> +1
              </Option>
              <Option value="+33">
                <img src="/flags/fr.png" alt="French flag" className={styles.flagImage} /> +33
              </Option>
            </Select>
            <span className={styles.dashsign}> - </span>
            <Input
              value={formValues.phoneNumber}
              placeholder={t("Phone Number")}
              maxLength={10}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>
          {errors.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
          </div>
        </div>
      </div>



      <div className={styles.sixthRow}>
        {/* 
        ===================================================================
                            PASSPORT NO INPUT FIELD
        ===================================================================
        */}
      
        <div className={styles.set9}>
          <label>{t("Passport No")}:</label>
          <Input
            className={styles.passport}
            value={formValues.passportNo}
            placeholder={t("Passport Number")}
            onChange={(e) => handleChange("passportNo", e.target.value)}
          />
        </div>
      </div>



      <div className={styles.seventhRow}>
        {/* 
        ===================================================================
                          EXPECTED SALARY INPUT FIELD
        ===================================================================
        */}
        <div className={styles.set10}>
            <label><span className={styles.redFont}>*</span> {t("Expected Salary")}:</label>
            <div className={styles.field}>
            <Input
              className={styles.salary}
              value={formValues.expectedSalary}
              placeholder={t("Expected Salary")}
              onChange={(e) => handleChange("expectedSalary", e.target.value)}
            />
          {errors.expectedSalary && <div className={styles.error}>{errors.expectedSalary}</div>}
          </div>
        </div>
        {/* 
        ===================================================================
                            RESET AND SUBMIT BUTTON
        ===================================================================
        */}
        <div className={styles.buttonStyle}>
          <Button onClick={() => dispatch(resetFormData())}>{t("RESET")}</Button>
          <Button onClick={handleSubmit}>
            {t("SUBMIT")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
