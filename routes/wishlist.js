const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const { ensureAuthenticatedApi } = require("../middlewares/authenticateApi");

router.post("/add", ensureAuthenticatedApi, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Check if the product is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (existingWishlistItem) {
      return res
        .status(400)
        .json({ message: "Product is already in your wishlist" });
    }

    // Add the product to the wishlist
    const newWishlistItem = new Wishlist({ user: userId, product: productId });
    await newWishlistItem.save();

    res.status(201).json({
      message: "Product added to wishlist",
      operation:true,
      wishlistItem: newWishlistItem,
    });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from Wishlist
router.post("/remove", ensureAuthenticatedApi, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Remove the product from the wishlist
    await Wishlist.findOneAndDelete({ user: userId, product: productId });

    res.status(200).json({ message: "Product removed from wishlist" ,operation:true,});
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate("product") // Populate the product details
      .exec();
    res.render("wishlist", {
      title: "Wishlist",
      bodyClass:"user-wishlist blog",
      wishlistItems,
    });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
