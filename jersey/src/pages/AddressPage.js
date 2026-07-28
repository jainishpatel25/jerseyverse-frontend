// import React, { useState, useEffect } from 'react';

// import AddressForm from './AddressForm';
// import AddressSelect from './AddressSelect';

// const AddressPage = () => {
//   const [hasAddress, setHasAddress] = useState(false);

//   useEffect(() => {
//     const savedAddress = localStorage.getItem('userAddress');
//     if (savedAddress) {
//       setHasAddress(true);
//     }
//   }, []);

//   const handleAddressSaved = () => {
//     setHasAddress(true);
//   };

//   return (
//     <>
//       {!hasAddress ? (
//         <AddressForm onConfirm={handleAddressSaved} />
//       ) : (
//         <AddressSelect />
//       )}
//     </>
//   );
// };

// export default AddressPage;
import React from "react";
import AddressSelect from "./AddressSelect";

const AddressPage = () => {
  return <AddressSelect />;
};

export default AddressPage;
