import React, { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import AddressSelect from "./AddressSelect";
import api from "../utils/api"; // adjust path if required

const AddressPage = () => {
  const [hasAddress, setHasAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAddresses = async () => {
      try {
        const response = await api.get("/api/v1/addresses");

        const addresses = response.data || [];

        setHasAddress(addresses.length > 0);
      } catch (error) {
        console.error("Failed to check addresses:", error);
        setHasAddress(false);
      } finally {
        setLoading(false);
      }
    };

    checkAddresses();
  }, []);

  const handleAddressSaved = () => {
    setHasAddress(true);
  };

  if (loading) {
    return <div className="text-center my-5">Loading addresses...</div>;
  }

  return (
    <>
      {!hasAddress ? (
        <AddressForm onConfirm={handleAddressSaved} />
      ) : (
        <AddressSelect />
      )}
    </>
  );
};

export default AddressPage;
