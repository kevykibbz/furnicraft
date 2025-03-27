const { Category, SubCategory } = require("../models/Category");

let cachedCategories = null;
let lastUpdated = null;

const MAX_DEPTH = 3;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Core function to fetch categories (reusable)
const fetchCategoriesData = async () => {
  const now = new Date();

  // Check cache validity
  if (cachedCategories && lastUpdated && now - lastUpdated < CACHE_DURATION) {
    console.log("Using cached categories");
    return cachedCategories;
  }

  // Fetch top-level categories
  const categories = await Category.find({ isHidden: false })
    .sort({ name: 1 })
    .lean();

  // Recursive function to populate subcategories
  const populateSubCategories = async (parentId, currentDepth = 1) => {
    if (currentDepth > MAX_DEPTH) return [];

    const subCategories = await SubCategory.find({
      $or: [{ parentCategory: parentId }, { parentSubCategory: parentId }],
      isHidden: false,
    })
      .sort({ name: 1 })
      .lean();

    await Promise.all(
      subCategories.map(async (subCategory) => {
        subCategory.subCategories = await populateSubCategories(
          subCategory._id,
          currentDepth + 1
        );
      })
    );

    return subCategories;
  };

  await Promise.all(
    categories.map(async (category) => {
      category.subCategories = await populateSubCategories(category._id);
    })
  );

  // Update cache
  cachedCategories = categories;
  lastUpdated = new Date();

  return categories;
};

// Middleware version (adds to req.categories)
const fetchCategoriesMiddleware = async (req, res, next) => {
  try {
    req.categories = await fetchCategoriesData();
    next();
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Server error");
  }
};

// Direct access version
const fetchCategoriesDirect = async () => {
  try {
    return await fetchCategoriesData();
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err; // Let the caller handle the error
  }
};

// Clear cache when categories are updated
const clearCategoryCache = () => {
  cachedCategories = null;
  lastUpdated = null;
};

module.exports = {
  fetchCategoriesMiddleware,
  fetchCategoriesDirect,
  clearCategoryCache,
};