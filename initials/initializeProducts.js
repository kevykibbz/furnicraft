const { Product, Category, SubCategory } = require("../models");

const initializeDefaultProducts = async () => {
  try {
    const existingProduct = await Product.findOne({ SKU: "PROD-001" });
    
    if (existingProduct) {
      console.log("Products already exist in database. Skipping initialization.");
      return;
    }

    // Get required categories
    const livingRoom = await Category.findOne({ slug: "living-room" });
    const sofaSubCat = await SubCategory.findOne({ slug: "sofa" });
    const armchairSubCat = await SubCategory.findOne({ slug: "armchair" });
    const coffeeTableSubCat = await SubCategory.findOne({
      slug: "coffee-table",
    });

    if (!livingRoom || !sofaSubCat || !armchairSubCat || !coffeeTableSubCat) {
      throw new Error("Required categories not found");
    }

    const validUserId = "67e3b39ca327ea6ef872564c";
    // Default products data with ALL images
    const defaultProducts = [
      // New Arrivals - Product 1
      {
        name: "Nulla et justo non augue",
        SKU: "PROD-001",
        description: "Premium modern sofa with ergonomic design",
        price: 28.68,
        discountPrice: 20.08,
        stockStatus: "in-stock",
        stockQuantity: 15,
        images: [
          {
            url: "/img/product/1.jpg",
            altText: "Modern Sofa Front View",
            isPrimary: true,
          },
          { url: "/img/product/5.jpg", altText: "Modern Sofa Side View" },
          { url: "/img/product/3.jpg", altText: "Modern Sofa Detail" },
          { url: "/img/product/9.jpg", altText: "Modern Sofa in Room Setting" },
        ],
        colors: [
          { name: "Beige", hexCode: "#F5F5DC", stock: 8 },
          { name: "Orange", hexCode: "#FFA500", stock: 4 },
          { name: "Green", hexCode: "#008000", stock: 3 },
        ],
        sizes: [
          { name: "Small", stock: 5 },
          { name: "Large", stock: 10 },
        ],
        mainCategory: livingRoom._id,
        subCategory: sofaSubCat._id,
        marketingCategories: ["new-arrivals"],
        tags: ["sofa", "modern", "living-room"],
        isFeatured: true,
        reviews: [
          {
            user: validUserId,
            rating: 5,
            comment: "Extremely comfortable and stylish!",
          },
        ],
      },

      // New Arrivals - Product 2
      {
        name: "Nam semper a ligula nec",
        SKU: "PROD-002",
        description: "Classic armchair with premium upholstery",
        price: 35.99,
        discountPrice: 28.79,
        stockStatus: "in-stock",
        stockQuantity: 10,
        images: [
          {
            url: "/img/product/3.jpg",
            altText: "Armchair Front View",
            isPrimary: true,
          },
          { url: "/img/product/9.jpg", altText: "Armchair Side View" },
          { url: "/img/product/2.jpg", altText: "Armchair Detail" },
          { url: "/img/product/17.jpg", altText: "Armchair in Setting" },
        ],
        colors: [
          { name: "Beige", hexCode: "#F5F5DC", stock: 5 },
          { name: "Black", hexCode: "#000000", stock: 5 },
        ],
        mainCategory: livingRoom._id,
        subCategory: armchairSubCat._id,
        marketingCategories: ["new-arrivals"],
        tags: ["armchair", "classic", "living-room"],
      },

      // New Arrivals - Product 3
      {
        name: "Phasellus vitae",
        SKU: "PROD-003",
        description: "Contemporary furniture piece with clean lines",
        price: 20.08,
        stockStatus: "in-stock",
        stockQuantity: 8,
        images: [
          {
            url: "/img/product/2.jpg",
            altText: "Product front view",
            isPrimary: true,
          },
          { url: "/img/product/17.jpg", altText: "Product alternate view" },
        ],
        colors: [
          { name: "Beige", hexCode: "#F5F5DC", stock: 3 },
          { name: "Orange", hexCode: "#FFA500", stock: 3 },
          { name: "Green", hexCode: "#008000", stock: 2 },
        ],
        mainCategory: livingRoom._id,
        subCategory: sofaSubCat._id,
        marketingCategories: ["new-arrivals"],
        tags: ["modern", "living-room", "contemporary"],
        reviews: [
          {
            user: validUserId,
            rating: 4,
            comment: "Great quality and perfect size for our space",
          },
        ],
      },
      // Best Sellers - Product 1
      {
        name: "Phasellus vitae",
        SKU: "PROD-004",
        description: "Luxury coffee table with tempered glass top",
        price: 45.5,
        stockStatus: "in-stock",
        stockQuantity: 7,
        images: [
          {
            url: "/img/product/4.jpg",
            altText: "Coffee Table Top View",
            isPrimary: true,
          },
          { url: "/img/product/10.jpg", altText: "Coffee Table Side View" },
          { url: "/img/product/6.jpg", altText: "Coffee Table Detail" },
          { url: "/img/product/13.jpg", altText: "Coffee Table in Setting" },
        ],
        mainCategory: livingRoom._id,
        subCategory: coffeeTableSubCat._id,
        marketingCategories: ["best-sellers"],
        tags: ["coffee-table", "luxury", "living-room"],
        isFeatured: true,
        reviews: [
          {
            user: validUserId,
            rating: 4,
            comment: "Beautiful table, perfect for our living room",
          },
        ],
      },

      // Best Sellers - Product 2
      {
        name: "Premium Sectional Sofa",
        SKU: "PROD-005",
        description: "Spacious L-shaped sectional with premium fabric",
        price: 89.99,
        discountPrice: 79.99,
        stockStatus: "in-stock",
        stockQuantity: 12,
        images: [
          {
            url: "/img/product/5.jpg",
            altText: "Sectional Front View",
            isPrimary: true,
          },
          { url: "/img/product/12.jpg", altText: "Sectional Side View" },
          { url: "/img/product/8.jpg", altText: "Sectional Detail" },
          { url: "/img/product/15.jpg", altText: "Sectional in Room" },
        ],
        colors: [
          { name: "Gray", hexCode: "#808080", stock: 8 },
          { name: "Navy", hexCode: "#000080", stock: 4 },
        ],
        sizes: [
          { name: "Standard", stock: 7 },
          { name: "XL", stock: 5 },
        ],
        mainCategory: livingRoom._id,
        subCategory: sofaSubCat._id,
        marketingCategories: ["best-sellers"],
        tags: ["sectional", "premium", "living-room"],
      },

      // Best Sellers - Product 3
      {
        name: "Modern Lounge Chair",
        SKU: "PROD-006",
        description: "Sleek lounge chair with premium upholstery",
        price: 20.08,
        stockStatus: "in-stock",
        stockQuantity: 6,
        images: [
          {
            url: "/img/product/6.jpg",
            altText: "Lounge chair front view",
            isPrimary: true,
          },
          { url: "/img/product/13.jpg", altText: "Lounge chair side view" },
        ],
        colors: [
          { name: "Beige", hexCode: "#F5F5DC", stock: 2 },
          { name: "Orange", hexCode: "#FFA500", stock: 2 },
          { name: "Green", hexCode: "#008000", stock: 2 },
        ],
        mainCategory: livingRoom._id,
        subCategory: armchairSubCat._id,
        marketingCategories: ["best-sellers"],
        tags: ["lounge", "chair", "modern"],
        reviews: [
          {
            user: validUserId,
            rating: 5,
            comment: "Perfect addition to our reading nook!",
          },
        ],
      },

      // Featured Products - Product 1
      {
        name: "Modern Ottoman",
        SKU: "PROD-007",
        description: "Versatile ottoman with storage compartment",
        price: 32.5,
        stockStatus: "in-stock",
        stockQuantity: 9,
        images: [
          {
            url: "/img/product/7.jpg",
            altText: "Ottoman Top View",
            isPrimary: true,
          },
          { url: "/img/product/14.jpg", altText: "Ottoman Side View" },
          { url: "/img/product/9.jpg", altText: "Ottoman Open" },
          { url: "/img/product/16.jpg", altText: "Ottoman in Use" },
        ],
        colors: [
          { name: "Black", hexCode: "#000000", stock: 6 },
          { name: "White", hexCode: "#FFFFFF", stock: 3 },
        ],
        mainCategory: livingRoom._id,
        subCategory: sofaSubCat._id,
        marketingCategories: ["special-products"],
        tags: ["ottoman", "storage", "living-room"],
        isFeatured: true,
      },
      // Featured Products - Product 2
      {
        name: "Nulla et justo non augue",
        SKU: "PROD-008",
        description: "Stylish and modern sofa with a comfortable design",
        price: 20.08,
        regularPrice: 28.68, // Original price before discount
        discount: 20, // Percentage discount
        stockStatus: "in-stock",
        stockQuantity: 10,
        images: [
          {
            url: "/img/product/8.jpg",
            altText: "Sofa Front View",
            isPrimary: true,
          },
          { url: "/img/product/15.jpg", altText: "Sofa Side View" },
        ],
        colors: [
          { name: "Beige", hexCode: "#F5F5DC", stock: 4 },
          { name: "Orange", hexCode: "#FFA500", stock: 3 },
          { name: "Green", hexCode: "#008000", stock: 3 },
        ],
        mainCategory: livingRoom._id,
        subCategory: sofaSubCat._id,
        marketingCategories: ["special-products"],
        tags: ["sofa", "discount", "modern"],
        isFeatured: true,
      },
      // Featured Products - Product 3
      {
        name: "Nulla et justo non augue",
        SKU: "PROD-009",
        description: "Elegant and modern living room set",
        price: 20.08,
        regularPrice: 28.68,
        discount: 20,
        stockStatus: "in-stock",
        stockQuantity: 12,
        images: [
          {
            url: "/img/product/9.jpg",
            altText: "Living Room Set Front",
            isPrimary: true,
          },
          { url: "/img/product/16.jpg", altText: "Living Room Set Side View" },
        ],
        colors: [
          { name: "Beige", hexCode: "#F5F5DC", stock: 5 },
          { name: "Orange", hexCode: "#FFA500", stock: 4 },
          { name: "Green", hexCode: "#008000", stock: 3 },
        ],
        mainCategory: livingRoom._id,
        subCategory: sofaSubCat._id,
        marketingCategories: ["special-products"],
        tags: ["living-room", "modern", "luxury"],
        isFeatured: false,
      },
    ];

    // Insert products
    await Product.insertMany(defaultProducts);
    console.log(
      `Successfully initialized ${defaultProducts.length} products with all images`
    );
  } catch (err) {
    console.error("Error initializing products:", err);
    process.exit(1);
  }
};

module.exports = initializeDefaultProducts;
