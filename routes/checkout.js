const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const cartItems = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cartItems) {
      if (req.accepts("html")) {
        return res.status(404).render("404", {
          message: "Cart not found",
          title: "Your Cart",
          bodyId: "page-404",
          bodyClass: "blog",
        });
      } else {
        return res.status(404).json({
          error: "Cart not found",
        });
      }
    }

    res.render("checkout", {
      title: "Checkout",
      bodyClass: "product-checkout checkout-cart",
      cartItems: cartItems,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
