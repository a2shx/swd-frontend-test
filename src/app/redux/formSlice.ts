import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormState {
  title: string;
  firstName: string;
  lastName: string;
  birthday: string | null; // Refined to 'string | null'
  nationality: string;
  citizenId: string[];
  gender: string;
  countryCode: string;
  phoneNumber: string;
  passportNo: string;
  expectedSalary: string;
  errors: Record<string, string>;
}

// Payload interface for updating form data, with specific value types per field
interface UpdateFormDataPayload {
  field: keyof FormState; // Ensures `field` is one of the keys in FormState
  value: string | string[] | Record<string, string> | Date | null; // Allow Date for birthday
}

const initialState: FormState = {
  title: "",
  firstName: "",
  lastName: "",
  birthday: null,
  nationality: "",
  citizenId: ["", "", "", "", ""],
  gender: "",
  countryCode: "",
  phoneNumber: "",
  passportNo: "",
  expectedSalary: "",
  errors: {}, // Initialize errors as an empty object
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Updates a specific form field with a value that matches the field's type
    updateFormData: (state, action: PayloadAction<UpdateFormDataPayload>) => {
      const { field, value } = action.payload;

      // Special handling for 'birthday' field to store as ISO string
      if (field === 'birthday') {
        if (value === null || typeof value === 'string') {
          state.birthday = value; // Ensure it's stored as string or null
        }
      } else if (field === 'citizenId') {
        if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
          state.citizenId = value; // Ensure it's an array of strings
        }
      } else if (field === 'errors') {
        if (typeof value === 'object' && value !== null) {
          state.errors = value as Record<string, string>; // Ensure it's a valid object for errors
        }
      } else {
        // For all other fields (string values), directly assign the value
        if (typeof value === 'string') {
          state[field] = value;
        }
      }
    },

    // Resets the form data to the initial state
    resetFormData: (state) => {
      Object.assign(state, initialState); // Revert to initial state
    },

    // Sets validation errors for fields
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload; // Set form errors
    },
  },
});

export const { 
  updateFormData, 
  resetFormData, 
  setErrors 
} = formSlice.actions;

export default formSlice.reducer;
