const { Cart } = require("../models");

const fetchCart = async (req, res, next) => {
  try {
    let cart = { items: [] };

    if (req.isAuthenticated()) {
      const userCart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
      );
      if (userCart) {
        cart = userCart;
      }
    }
    res.locals.cart = cart;
    next();
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).send("Server error");
  }
};

module.exports = fetchCart;
