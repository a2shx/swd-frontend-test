// "use client";

// import { useDispatch } from "react-redux";
// import { deleteSelected } from "../redux/formSlice";
// import { useState } from "react";

// const DeleteAllButton = () => {
//   const dispatch = useDispatch();
//   const [isDeleted, setIsDeleted] = useState(false);

//   const handleDeleteAll = () => {
//     dispatch(deleteSelected([])); // Delete all items
//     setIsDeleted(true);
//     setTimeout(() => {
//       setIsDeleted(false);
//     }, 2000); // Reset state after 2 seconds
//   };

//   return (
//     <div>
//       <button onClick={handleDeleteAll}>Delete All</button>
//       {isDeleted && <div>Delete Success</div>}
//     </div>
//   );
// };

// export default DeleteAllButton;
