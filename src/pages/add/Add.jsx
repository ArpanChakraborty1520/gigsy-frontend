import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewCover, setPreviewCover] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handle input changes
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  // Add features
  const handleFeature = (e) => {
    e.preventDefault();
    if (e.target[0].value.trim() !== "") {
      dispatch({
        type: "ADD_FEATURE",
        payload: e.target[0].value,
      });
    }
    e.target[0].value = "";
  };

  // File selection with preview
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setSingleFile(file);
    setPreviewCover(URL.createObjectURL(file));
  };

  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviewImages(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  // Create gig mutation
  const mutation = useMutation({
    mutationFn: (gig) => newRequest.post("/gigs", gig),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      alert("Gig created successfully ✅");
      navigate("/mygigs");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to create gig ❌");
    },
  });

  // Submit gig with automatic image upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload cover image
      const coverUrl = singleFile
        ? await upload(singleFile)
        : "https://via.placeholder.com/400x300?text=No+Image";

      // Upload additional images
      const imagesUrls = files.length
        ? await Promise.all(files.map(async (file) => await upload(file)))
        : ["https://via.placeholder.com/400x300?text=No+Image"];

      const gigData = {
        title: state.title || "Untitled Gig",
        cat: state.cat || "general",
        desc: state.desc || "No description provided.",
        price: state.price || 5,
        cover: coverUrl,
        images: imagesUrls,
        shortTitle: state.shortTitle || "No Title",
        shortDesc: state.shortDesc || "No details provided.",
        deliveryDate: state.deliveryDate || 1,
        revisionNumber: state.revisionNumber || 1,
        features: state.features || [],
      };

      mutation.mutate(gigData);
    } catch (error) {
      console.error("Error submitting gig:", error);
      alert("Failed to create gig ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Create a New Gig</h1>
        <div className="sections">
          {/* Left Section */}
          <div className="info">
            <label>Gig Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will design a modern website for your business"
              onChange={handleChange}
            />

            <label>Category *</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="">Select a Category</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>

            <div className="images">
              <div className="imagesInputs">
                <label>Cover Image *</label>
                <input type="file" accept="image/*" onChange={handleCoverChange} />
                {previewCover && <img src={previewCover} alt="Preview" width="100" />}

                <label>Additional Images</label>
                <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
                <div className="preview-container">
                  {previewImages.map((src, index) => (
                    <img key={index} src={src} alt="Preview" width="80" />
                  ))}
                </div>
              </div>
            </div>

            <label>Full Description *</label>
            <textarea
              name="desc"
              placeholder="Describe your service in detail..."
              rows="10"
              onChange={handleChange}
            ></textarea>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isLoading || uploading}
            >
              {mutation.isLoading || uploading ? "Creating..." : "Create Gig"}
            </button>
          </div>

          {/* Right Section */}
          <div className="details">
            <label>Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page website design"
              onChange={handleChange}
            />

            <label>Short Description</label>
            <textarea
              name="shortDesc"
              placeholder="Brief overview of your service"
              rows="5"
              onChange={handleChange}
            ></textarea>

            <label>Delivery Time (Days)</label>
            <input type="number" name="deliveryDate" onChange={handleChange} />

            <label>Revisions</label>
            <input type="number" name="revisionNumber" onChange={handleChange} />

            <label>Add Features</label>
            <form className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. Responsive design" />
              <button type="submit">Add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_FEATURE", payload: f })}
                  >
                    {f} <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label>Price ($)</label>
            <input type="number" name="price" onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
