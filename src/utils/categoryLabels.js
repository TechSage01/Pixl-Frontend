// Same ids as the backend utils/categories.js
export const CATEGORY_LABELS = {
  tech: "Tech & laptops",
  electronics: "Electronics & gadgets",
  "phone-accessories": "Phone accessories",
  fashion: "Fashion & jewelry",
  books: "Books & stationery",
  home: "Home & decor",
  furniture: "Furniture",
  hostel: "Hostel & accommodation",
  sports: "Sports & fitness",
  food: "Food & groceries",
  utensils: "Kitchen & utensils",
  other: "Others",
};
export const categoryLabel = (id) => CATEGORY_LABELS[id] || id;