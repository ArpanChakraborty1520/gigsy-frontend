export const INITIAL_STATE = {
  title: "",
  cat: "",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryDate: 1,
  revisionNumber: 1,
  features: [],
  price: "",
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    // ✅ Handles all input changes (text, select, number, etc.)
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    // ✅ Adds a feature to the list
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };

    // ✅ Removes a specific feature
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter((feature) => feature !== action.payload),
      };

    // ✅ Handles uploaded images and cover
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };

    // ✅ Resets state after successful gig creation
    case "RESET":
      return INITIAL_STATE;

    default:
      return state;
  }
};
