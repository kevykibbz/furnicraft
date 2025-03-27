const express = require("express");
const {Order,Cart} = require("../models");
const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/authMiddleware");


router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; 
    const order = new Order(req.body);
    await order.save();

    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } }, // Empty the items array
      { new: true }
    );

    res.status(201).json({ 
      message: "Order created successfully", 
      order,
      cartCleared: true
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:order_id",async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
          return res.redirect("/?modal=signin");
    }

    const { order_id } = req.params;
    const order = await Order.findById(order_id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.render("orders", {
      title: "Orders",
      order
    });

  } catch (err) {
    console.error("Error getting order details:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;