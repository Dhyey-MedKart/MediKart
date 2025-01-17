export const uploadToCloudinary = async (file) => {
  try {
      const formData = new FormData();
      formData.append("file", file); // The image file
      formData.append("upload_preset", "crudabcd"); // Replace with your upload preset from Cloudinary
      formData.append("cloud_name", "dfizmtemg"); // Replace with your Cloudinary cloud name
      
      const response = await fetch(
          `https://api.cloudinary.com/v1_1/dfizmtemg/image/upload`, // Replace 'your_cloud_name'
          {
              method: "POST",
              body: formData,
          }
      );
      const imageData = await response.json();
      // const imageUrl = imageData.url.toString();
      // The response will contain the URL of the uploaded image
       return imageData.secure_url;
  } catch (error) {
      throw new Error(
          error.response?.data?.message || error.message || "Failed to upload image to Cloudinary"
      );
  }
};

export const UploadMultiImage = async (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadToCloudinary(base));
    console.log(uploads);
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};


export default UploadMultiImage;