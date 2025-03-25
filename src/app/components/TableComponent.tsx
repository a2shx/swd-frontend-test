"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFormData, setEditingId } from '../redux/formSlice';
import { RootState } from '../redux/store'; 

const TableComponent = () => {
  const formData = useSelector((state: RootState) => state.form.formData); 
  const dispatch = useDispatch();

  // Debug: Log formData to check for duplicates
  console.log("Form Data:", formData);

  const handleDelete = (id: string) => {
    dispatch(deleteFormData(id)); // Dispatch to delete from Redux store
    const updatedData = formData.filter((data) => data.id !== id);
    localStorage.setItem("userFormData", JSON.stringify(updatedData)); // Update localStorage after deleting from Redux store
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((data) => (
            <tr key={data.id}>  {/* Ensure 'id' is unique */}
              <td>{data.title}</td>
              <td>{data.firstName}</td>
              <td>{data.lastName}</td>
              <td>
                <button onClick={() => dispatch(setEditingId(data.id))}>Edit</button>
                <button onClick={() => handleDelete(data.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
