const mongoose = require("mongoose");
const { Schema } = mongoose;

// Review Sub-Schema
const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Product Main Schema
const productSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      virtual: true,
      get: function () {
        return this.discountPrice
          ? Math.round(((this.price - this.discountPrice) / this.price) * 100)
          : 0;
      },
    },

    // Inventory
    stockStatus: {
      type: String,
      enum: ["in-stock", "out-of-stock", "pre-order", "backorder"],
      default: "in-stock",
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Media
    images: [
      {
        url: String,
        altText: String,
        isPrimary: Boolean,
      },
    ],

    // Variants
    sizes: [
      {
        name: String,
        stock: Number,
      },
    ],
    colors: [
      {
        name: String,
        hexCode: String,
        stock: Number,
      },
    ],

    // Categorization
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    marketingCategories: [
      {
        type: String,
        enum: ["new-arrivals", "best-sellers", "special-products"],
      },
    ],
    tags: [String],

    // Reviews
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Flags
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
  }
);

// Auto-calculate average rating
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  }
  next();
});

// Indexes for performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ mainCategory: 1, subCategory: 1 });
productSchema.index({ price: 1, discountPrice: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ marketingCategories: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
