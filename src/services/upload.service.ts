import axios from 'axios';

// Note: In a real app, these should be in .env
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'; 
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      if (!CLOUD_NAME || !UPLOAD_PRESET || UPLOAD_PRESET === 'your_unsigned_upload_preset') {
        console.error('Cloudinary Configuration Error:', { CLOUD_NAME, UPLOAD_PRESET });
        throw new Error('Missing or invalid Cloudinary configuration. Please check your .env file.');
      }

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      
      return response.data.secure_url;
    } catch (error: any) {
      console.error('Cloudinary Upload Error Details:', error.response?.data || error.message);
      throw error;
    }
  },
};
