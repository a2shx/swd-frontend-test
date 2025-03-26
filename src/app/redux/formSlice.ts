import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormState {
  title: string;
  firstName: string;
  lastName: string;
  birthday: any;
  nationality: string;
  citizenId: string[];
  gender: string;
  countryCode: string;
  phoneNumber: string;
  passportNo: string;
  expectedSalary: string;
  errors: Record<string, string>;

}

interface UpdateFormDataPayload {
    field: keyof FormState; // Ensures `field` is one of the keys in FormState
    value: any; // Value can be of any type
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
  errors: {}, // Initialize errors
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Use the new type for the PayloadAction
    updateFormData: (state, action: PayloadAction<UpdateFormDataPayload>) => {
        const { field, value } = action.payload;
  
        if (field === 'birthday' && value instanceof Date) {
          state.birthday = value.toISOString(); // Ensure it's stored as a string
        } else {
          state[field] = value;
        }
      },

    resetFormData: (state) => {
      Object.assign(state, initialState);
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload; // Update errors in the state
    },
  
  },
});

export const { 
    updateFormData, 
    resetFormData, 
    setErrors, 
  } = formSlice.actions;

export default formSlice.reducer;
