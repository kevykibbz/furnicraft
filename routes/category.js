const express = require("express");
const router = express.Router();
const { Product, Category, Wishlist,SubCategory } = require("../models");
const { fetchCategoriesDirect } = require("../middlewares/fetchCategories");

router.get("/:slug", async (req, res) => {
  try {
    const categorySlug = req.params.slug;
    const categories = await fetchCategoriesDirect();

    // Find main category and populate its subcategories
    const category = await Category.findOne({ slug: categorySlug })
      .populate("subCategories")
      .lean();

    if (!category) {
      return res.status(404).render("404", { title: "Category Not Found" });
    }

    // Get products only for the main category
    const products = await Product.find({
      mainCategory: category._id,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    let wishlist = [];
    if (req.isAuthenticated()) {
      wishlist = await Wishlist.find({ user: req.user._id }).select("product");
    }

    res.render("category", {
      title: `${category.name} Products`,
      bodyId: "product-sidebar-left",
      bodyClass: "product-grid-sidebar-left",
      currentCategory: category,
      categories,
      products,
      wishlist: wishlist.map((item) => item.product.toString()),
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).render("500");
  }
});


// @desc    Get subcategories by category ID
// @route   GET /api/categories/:categoryId/subcategories
// @access  Public
router.get('/:categoryId/subcategories', async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ 
      parentCategory: req.params.categoryId 
    }).select('_id name'); // Only return id and name

    res.json(subCategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ 
      message: 'Error fetching subcategories',
      error: error.message 
    });
  }
});

module.exports = router;
