// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../redux/store";
// import { deleteData, deleteSelected } from "../redux/formSlice";
// import { useState } from "react";

// const TableComponent = ({ setEditingData }: any) => {
//   const dispatch = useDispatch();
//   const formData = useSelector((state: RootState) => state.form);
//   const [page, setPage] = useState(1);
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);

//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(formData.length / itemsPerPage);

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       const allIds = formData.map((item) => item.id);
//       setSelectedItems(allIds);
//     } else {
//       setSelectedItems([]);
//     }
//   };

//   const handleSelectItem = (id: string) => {
//     setSelectedItems((prevSelectedItems) =>
//       prevSelectedItems.includes(id)
//         ? prevSelectedItems.filter((item) => item !== id)
//         : [...prevSelectedItems, id]
//     );
//   };

//   const handleDelete = (id: string) => {
//     dispatch(deleteData(id));
//   };

//   const handleDeleteSelected = () => {
//     dispatch(deleteSelected(selectedItems));
//     setSelectedItems([]);
//   };

//   const startIndex = (page - 1) * itemsPerPage;
//   const currentItems = formData.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div>
//       <div>
//         <button onClick={handleDeleteSelected} disabled={selectedItems.length === 0}>
//           Delete Selected
//         </button>
//         <table>
//           <thead>
//             <tr>
//               <th>
//                 <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === formData.length} />
//               </th>
//               <th>Name</th>
//               <th>Gender</th>
//               <th>Phone</th>
//               <th>Nationality</th>
//               <th>Manage</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map((item) => (
//               <tr key={item.id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={selectedItems.includes(item.id)}
//                     onChange={() => handleSelectItem(item.id)}
//                   />
//                 </td>
//                 <td>{item.firstName} {item.lastName}</td>
//                 <td>{item.gender}</td>
//                 <td>{item.phone}</td>
//                 <td>{item.nationality}</td>
//                 <td>
//                   <button onClick={() => setEditingData(item)}>Edit</button>
//                   <button onClick={() => handleDelete(item.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div>
//           <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
//             Prev
//           </button>
//           <span>Page {page} of {totalPages}</span>
//           <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableComponent;
