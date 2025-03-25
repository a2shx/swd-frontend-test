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
  formData: FormData[]; // New array to store form entries
  editingId: string | null; // New field to track which item is being edited
}

interface FormData {
    id: string;
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
  countryCode: "+66",
  phoneNumber: "",
  passportNo: "",
  expectedSalary: "",
  errors: {}, // Initialize errors
  formData: [], // Initialize formData as an empty array
  editingId: null, // No item is being edited initially
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
    setEditingId: (state, action: PayloadAction<string | null>) => {
        state.editingId = action.payload;
      },
      
      // Add new form entry to formData
      addNewFormData: (state, action: PayloadAction<FormData>) => {
        state.formData.push(action.payload);
      },
      
      // Update the existing form entry by ID
      updateFormEntry: (state, action: PayloadAction<FormData>) => {
        const index = state.formData.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.formData[index] = action.payload; // Update the item with new data
        }
      },
      
      // Delete form entry by ID
      deleteFormData: (state, action: PayloadAction<string>) => {
        state.formData = state.formData.filter(item => item.id !== action.payload);
      },
  },
});

export const { 
    updateFormData, 
    resetFormData, 
    setErrors, 
    setEditingId, 
    addNewFormData, 
    updateFormEntry, 
    deleteFormData 
  } = formSlice.actions;

export default formSlice.reducer;
