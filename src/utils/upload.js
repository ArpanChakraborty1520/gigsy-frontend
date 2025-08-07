import axios from "axios";

const upload = async (file) => {
  if (!file) {
    console.error("No file provided for upload");
    return null;
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr"); // Must exist in your Cloudinary settings

  try {
    const res = await axios.post(
      import.meta.env.VITE_UPLOAD_LINK, // Example: "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload"
      data
    );

    if (res.data.secure_url) {
      return res.data.secure_url; // ✅ Cloudinary returns secure_url
    } else if (res.data.url) {
      return res.data.url;
    } else {
      throw new Error("Upload failed: No URL returned from server");
    }
  } catch (err) {
    console.error("File upload error:", err.response?.data || err.message);
    return null;
  }
};

export default upload;
