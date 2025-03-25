"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewFormData } from '../redux/formSlice';
import { RootState } from '../redux/store';

const LoadFormData = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.formData);

  useEffect(() => {
    const savedData = localStorage.getItem("userFormData");
    if (savedData && formData.length === 0) { // Only dispatch if there's no data in Redux
      const formDataParsed = JSON.parse(savedData);
      dispatch(addNewFormData(formDataParsed)); // Dispatch action to add data to Redux store
    }
  }, [dispatch, formData.length]);

  return null; // This component doesn't render anything but performs side-effects
};

export default LoadFormData;
