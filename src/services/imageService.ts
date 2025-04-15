// src/services/imageService.ts
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset');
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dp5uejppz/image/upload`,
      { method: 'POST', body: formData }
    );
    
    const data = await response.json();
    return data.secure_url;
  };