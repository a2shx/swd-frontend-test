"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateFormData, resetFormData, setErrors } from "../redux/formSlice";
import { RootState } from "../redux/store";
import { Input, Select, DatePicker, Radio, Button, message } from "antd";
import { FormState } from '../redux/formSlice';
import dayjs from 'dayjs';

const { Option } = Select;

interface FormComponentProps {
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormComponent: React.FC<FormComponentProps> = ({ setFormSubmitted }) => {  
  const dispatch = useDispatch();
  const formValues = useSelector((state: RootState) => state.form);
  const errors = useSelector((state: RootState) => state.form.errors);

  // Validation function
  const validateForm = () => {
    const newErrors: any = {};

    // Validate each field individually but stop on the first error
    if (!formValues.title || formValues.title === '') {
      newErrors.title = "Title is required!";
    } if (!formValues.firstName || formValues.firstName === '') {
      newErrors.firstName = "First Name is required!";
    } if (!/^[A-Za-z\u0E00-\u0E7F\s]+$/.test(formValues.firstName)) {
      newErrors.firstName = "Please fill the real first name!";
    } if (!formValues.lastName || formValues.lastName === '') {
      newErrors.lastName = "Last Name is required!";
    } if (!/^[A-Za-z\u0E00-\u0E7F\s]+$/.test(formValues.lastName)) {
      newErrors.lastName = "Please fill the real last name!";
    } if (!formValues.birthday) {
      newErrors.birthday = "Birthday is required!";
    } if (!formValues.nationality || formValues.nationality === '') {
      newErrors.nationality = "Nationality is required!";
    } if (!formValues.gender || formValues.gender === '') {
      newErrors.gender = "Gender is required!";
    } if (!formValues.phoneNumber || formValues.phoneNumber === '') {
      newErrors.phoneNumber = "Phone Number is required!";
    } if (!/^\d+$/.test(formValues.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be a valid number!";
    } if (!formValues.expectedSalary || formValues.expectedSalary === '') {
      newErrors.expectedSalary = "Expected Salary is required!";
    }

    // Citizen ID validation (must be exactly 13 digits and a number)
    const citizenId = formValues.citizenId.join("");
    if (citizenId && citizenId.length !== 13) {
      newErrors.citizenId = "Citizen ID must be exactly 13 digits!";
    } else if (!/^\d+$/.test(citizenId)) {
      newErrors.citizenId = "Citizen ID must be a valid number!";
    }

    dispatch(setErrors(newErrors)); // Dispatch errors to Redux

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // If validation fails, don't submit
    }

    const formDataToSubmit = { ...formValues };

    const cleanedFormDataToSubmit = {
      ...formDataToSubmit,
      errors: {}, 
    };

    const uniqueKey = cleanedFormDataToSubmit.citizenId.join(""); // Join the citizenId array if it's an array

    const previousData = JSON.parse(localStorage.getItem("submittedForms") || "[]");

    const isDuplicate = previousData.some(
      (data: any) => data.citizenId.join("") === uniqueKey // Check based on unique key
    );

    if (isDuplicate) {
      message.warning("This data has already been submitted!");
      return; // Prevent submission
    }

    // If not a duplicate, proceed with submission
    previousData.push(cleanedFormDataToSubmit); // Add new data to the stored data
    localStorage.setItem("submittedForms", JSON.stringify(previousData));

    setFormSubmitted(true);

    console.log("Form data submitted:", cleanedFormDataToSubmit);

    // Reset form after successful submission
    dispatch(resetFormData());

    alert("Form submitted successfully!");
  };
  


  const handleChange = (field: keyof FormState, value: any) => {
    // If the field is 'birthday', convert any Date object to an ISO string
    if (field === 'birthday' && value instanceof Date) {
      value = value.toISOString(); // Convert Date object to ISO string
    }
    // Dispatch the updated form data
    dispatch(updateFormData({ field, value }));
  };
  /*
  ========================================================================
  JSX PART JSX PART JSX PART JSX PART JSX PART JSX PART JSX PART JSX PART
  ========================================================================
  */
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div>
        <label>Title *</label>
        <Select
          value={formValues.title}
          onChange={(value) => handleChange("title", value)}
          style={{ width: "100%" }}
        >
          <Option value="Mr">Mr.</Option>
          <Option value="Mrs">Mrs.</Option>
          <Option value="Ms">Ms.</Option>
        </Select>
        {errors.title && <div style={{ color: 'red' }}>{errors.title}</div>}

        <label>First Name *</label>
        <Input
          value={formValues.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
        {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}

        <label>Last Name *</label>
        <Input
          value={formValues.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}
      </div>

      <div>
        <label>Birthday *</label>
        <DatePicker
          value={formValues.birthday ? dayjs(formValues.birthday) : null} // Convert ISO string to dayjs object for display
          onChange={(date) => {
            if (date) {
              handleChange('birthday', date.toISOString()); // Convert Date (dayjs) to ISO string on change
            }
          }}
        />
        {errors.birthday && <div style={{ color: 'red' }}>{errors.birthday}</div>}

        <label>Nationality *</label>
        <Select
          value={formValues.nationality}
          onChange={(value) => handleChange("nationality", value)}
          style={{ width: "100%" }}
        >
          <Option value="Thai">Thai</Option>
          <Option value="French">French</Option>
          <Option value="American">American</Option>
        </Select>
        {errors.nationality && <div style={{ color: 'red' }}>{errors.nationality}</div>}
      </div>

      <div>
        <label>Citizen ID</label>
        <div style={{ display: "flex", gap: "5px" }}>
          {formValues.citizenId.map((_, index) => (
            <Input
              key={index}
              maxLength={index === 0 ? 1 : index === 1 ? 4 : index === 2 ? 5 : index === 3 ? 2 : 1}
              value={formValues.citizenId[index]}
              placeholder={`Part ${index + 1}`}
              onChange={(e) => {
                const newCitizenId = [...formValues.citizenId];
                newCitizenId[index] = e.target.value;
                handleChange("citizenId", newCitizenId);
              }}
              style={{ width: index === 0 ? "10%" : index === 3 ? "15%" : "20%" }}
            />
          ))}
        </div>
        {errors.citizenId && <div style={{ color: 'red' }}>{errors.citizenId}</div>}
      </div>

      <div>
        <label>Gender *</label>
        <Radio.Group
          value={formValues.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <Radio value="Male">Male</Radio>
          <Radio value="Female">Female</Radio>
          <Radio value="Unisex">Unisex</Radio>
        </Radio.Group>
        {errors.gender && <div style={{ color: 'red' }}>{errors.gender}</div>}
      </div>

      <div>
        <label>Mobile Phone *</label>
        <div style={{ display: "flex", gap: "5px" }}>
          <Select
            value={formValues.countryCode}
            onChange={(value) => handleChange("countryCode", value)}
          >
            <Option value="+66">🇹🇭 +66</Option>
            <Option value="+1">🇺🇸 +1</Option>
            <Option value="+33">🇫🇷 +33</Option>
          </Select>
          <Input
            value={formValues.phoneNumber}
            maxLength={10}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        {errors.phoneNumber && <div style={{ color: 'red' }}>{errors.phoneNumber}</div>}
      </div>

      <div>
        <label>Passport No (Optional)</label>
        <Input
          value={formValues.passportNo}
          onChange={(e) => handleChange("passportNo", e.target.value)}
        />

        <label>Expected Salary *</label>
        <Input
          value={formValues.expectedSalary}
          onChange={(e) => handleChange("expectedSalary", e.target.value)}
        />
        {errors.expectedSalary && <div style={{ color: 'red' }}>{errors.expectedSalary}</div>}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: "10px" }}>
        <Button onClick={() => dispatch(resetFormData())}>Reset</Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default FormComponent;
