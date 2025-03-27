const express = require("express");
const router = express.Router();
const { Product, Order, Wishlist } = require("../models");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");
const { fetchCategoriesDirect } = require("../middlewares/fetchCategories");

router.get("/", async (req, res) => {
  const categories = await fetchCategoriesDirect();

  // Find the Living Room category
  const livingRoomCategory = categories.find(
    (cat) => cat.slug === "living-room"
  );
  const kitchenCategory = categories.find((cat) => cat.slug === "kitchen");
  if (!livingRoomCategory) {
    throw new Error("Living Room category not found");
  }

  if (!kitchenCategory) {
    throw new Error("Kitchen category not found");
  }

  // Function to get all subcategory IDs recursively
  const getSubcategoryIds = (category) => {
    let ids = [category._id];
    if (category.subCategories && category.subCategories.length > 0) {
      category.subCategories.forEach((subCat) => {
        ids = ids.concat(getSubcategoryIds(subCat));
      });
    }
    return ids;
  };

  // Fetch products in parallel
  const [livingRoomProducts, kitchenProducts, recentProducts] =
    await Promise.all([
      livingRoomCategory
        ? getCategoryProducts(getSubcategoryIds(livingRoomCategory))
        : null,
      kitchenCategory
        ? getCategoryProducts(getSubcategoryIds(kitchenCategory))
        : null,
      Product.find({}).sort({ createdAt: -1 }).limit(3).lean(),
    ]);

  let wishlist = [];
  if (req.isAuthenticated()) {
    wishlist = await Wishlist.find({ user: req.user._id }).select("product");
  }

  res.render("index", {
    title: "Home Page",
    categories,
    livingRoomProducts,
    kitchenProducts,
    recentProducts,
    wishlist: wishlist.map((item) => item.product.toString()),
  });
});

// Helper function to get products for a category
async function getCategoryProducts(categoryIds, bestSellersOnly = false) {
  if (!categoryIds || categoryIds.length === 0) return null;

  const products = { newArrivals: [], bestSellers: [], specialProducts: [] };

  if (bestSellersOnly) {
    products.bestSellers = await Product.find({
      category: { $in: categoryIds },
    })
      .sort({ salesCount: -1 })
      .limit(12)
      .lean();
  } else {
    [products.newArrivals, products.bestSellers, products.specialProducts] =
      await Promise.all([
        Product.find({
          $or: [
            { mainCategory: { $in: categoryIds } },
            { subCategory: { $in: categoryIds } },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(8)
          .lean(),

        // Best Sellers
        Product.find({
          $or: [
            { mainCategory: { $in: categoryIds } },
            { subCategory: { $in: categoryIds } },
          ],
        })
          .sort({ salesCount: -1 })
          .limit(8)
          .lean(),

        Product.find({
          $or: [
            { mainCategory: { $in: categoryIds } },
            { subCategory: { $in: categoryIds } },
          ],
          $or: [{ onSale: true }, { isFeatured: true }],
        })
          .limit(8)
          .lean(),
      ]);
  }

  return products;
}

router.get("/about", (req, res) => {
  res.render("about", {
    title: "FurniCraft - About Us",
    bodyId: "about-us",
    bodyClass: "blog",
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "FurniCraft - Contact Us",
    bodyId: "contact",
    bodyClass: "blog",
  });
});

router.get("/login", async (req, res) => {
  res.render("login", {
    title: "FurniCraft - Login",
    bodyClass: "user-login blog",
  });
});

router.get("/register", async (req, res) => {
  res.render("register", {
    title: "FurniCraft - Register",
    bodyClass: "user-register blog",
  });
});

router.get("/user-acount", ensureAuthenticated, async (req, res) => {
  // Fetch orders for the authenticated user
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product"
  );
  res.render("user-account", {
    title: "FurniCraft - Dashboard",
    bodyClass: "user-acount",
    orders,
  });
});

module.exports = router;
