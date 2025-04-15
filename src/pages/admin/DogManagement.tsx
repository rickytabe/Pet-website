import { serverTimestamp } from "firebase/database";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Dog } from "../../types/user";

// pages/admin/DogManagement.tsx
const DogManagement = () => {
    const [newDog, setNewDog] = useState<Partial<Dog>>({});
    const { uploadImages } = useStorage();
  
    const handleSubmit = async () => {
      const imageUrls = await uploadImages(newDog.images);
      await addDoc(collection(db, 'dogs'), {
        ...newDog,
        images: imageUrls,
        createdAt: serverTimestamp()
      });
    };
  };
  
  export default DogManagement;