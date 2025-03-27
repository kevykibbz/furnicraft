const express = require("express");
const router = express.Router();
const { Cart, Wishlist } = require("../models");
const { ensureAuthenticatedApi } = require("../middlewares/authenticateApi");

// Add to Cart and Remove from Wishlist
router.post("/add", ensureAuthenticatedApi, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const wishlistItem = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (wishlistItem) {
      await Wishlist.deleteOne({ _id: wishlistItem._id });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in the cart, add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart.",
      cart,
    });
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove product from cart
router.post("/remove", ensureAuthenticatedApi, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cat items
router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      if (req.accepts("html")) {
        return res.status(404).render("404", {
          message: "Cart not found",
          title: "Your Cart",
          bodyId:"page-404",bodyClass:"blog",
        });
      } else {
        return res.status(404).json({
          error: "Cart not found",
        });
      }
    }

    res.render("cart", {
      title: "Your Cart",
      bodyClass: "product-cart checkout-cart blog",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
