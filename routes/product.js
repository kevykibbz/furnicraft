const express=require("express")
const router=express.Router()
const {Product,Wishlist}=require("../models")
const { fetchCategoriesDirect } = require('../middlewares/fetchCategories');
const { ensureAuthenticatedApi } = require('../middlewares/authenticateApi'); 
const { isAdmin } = require('../middlewares/isAdmin'); 
const { upload } = require('../middlewares/multer'); 

router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId).populate("mainCategory");
    if (!product) {
      return res.status(404).render("404", { title: "Product Not Found" });
    }

    const categories = await fetchCategoriesDirect();
   
    const [relatedProducts, bestSellers] = await Promise.all([
      Product.find({mainCategory: product.mainCategory._id,_id: { $ne: productId },isActive: true}).limit(4),
      Product.find({mainCategory: product.mainCategory._id,marketingCategories: "best-sellers",_id: { $ne: productId },isActive: true}).sort({ salesCount: -1,averageRating: -1}).limit(4)
    ]);

   
    let wishlist = [];
    if (req.isAuthenticated()) {
      wishlist = await Wishlist.find({ user: req.user._id }).select("product");
    }

    res.render("product", {
      title: `Product - ${product.name}`,
      bodyId:"product-detail",
      product,
      relatedProducts,
      bestSellers,
      categories,
      wishlist: wishlist.map((item) => item.product.toString()),
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).render("500", { title: "Server Error" });
  }
});

// @desc    Create a new product
// @route   POST /api/products/add
// @access  Private/Admin
router.post('/add', ensureAuthenticatedApi, isAdmin, upload.array('images'), async (req, res) => {
  try {
    // Process uploaded files

    const images = req.files.map(file => {
      const publicPath = file.path.replace(/\\/g, '/');
      const cleanPath = publicPath.replace(/^public\//, ''); // Removes "public/" from start
      return {
        path: cleanPath, // "uploads/products/image-123.jpg"
        url: `/${cleanPath}`, // "/uploads/products/image-123.jpg"
        fullUrl: `${req.protocol}://${req.get('host')}/${cleanPath}`,
        altText: req.body.name || 'Product image'
      };
    });


    // Set first image as primary if exists
    if (images.length > 0) {
      images[0].isPrimary = true;
    }

    // Process sizes and colors from form data
    const sizes = [];
    const colors = [];
    
    // Handle sizes if they exist in request
    if (req.body.sizes) {
      // If sizes come as array of objects
      if (Array.isArray(req.body.sizes)) {
        sizes.push(...req.body.sizes);
      } 
      // If sizes come as individual fields (from form)
      else {
        for (let key in req.body) {
          if (key.startsWith('sizes[')) {
            const match = key.match(/sizes\[(\d+)\]\[(\w+)\]/);
            if (match) {
              const index = match[1];
              const property = match[2];
              if (!sizes[index]) sizes[index] = {};
              sizes[index][property] = req.body[key];
            }
          }
        }
        // Filter out any empty sizes
        sizes = sizes.filter(size => size.name && size.name.trim() !== '');
      }
    }

    // Handle colors if they exist in request
    if (req.body.colors) {
      // If colors come as array of objects
      if (Array.isArray(req.body.colors)) {
        colors.push(...req.body.colors);
      } 
      // If colors come as individual fields (from form)
      else {
        for (let key in req.body) {
          if (key.startsWith('colors[')) {
            const match = key.match(/colors\[(\d+)\]\[(\w+)\]/);
            if (match) {
              const index = match[1];
              const property = match[2];
              if (!colors[index]) colors[index] = {};
              colors[index][property] = req.body[key];
            }
          }
        }
        // Filter out any empty colors
        colors = colors.filter(color => color.name && color.name.trim() !== '');
      }
    }

    // Process tags if they exist
    const tags = req.body.tags ? 
      (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(tag => tag.trim())) : 
      [];

    // Process marketing categories
    const marketingCategories = req.body.marketingCategories ?
      (Array.isArray(req.body.marketingCategories) ? req.body.marketingCategories : [req.body.marketingCategories]) :
      [];

    // Create product object
    const product = new Product({
      name: req.body.name,
      SKU: req.body.SKU,
      description: req.body.description,
      price: req.body.price,
      discountPrice: req.body.discountPrice || undefined,
      stockStatus: req.body.stockStatus,
      stockQuantity: req.body.stockQuantity || 0,
      images,
      sizes,
      colors,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      marketingCategories,
      tags,
      isFeatured: req.body.isFeatured === 'on',
      isActive: req.body.isActive === 'on',
      // Reviews and averageRating will be added automatically by the schema
    });

    // Save product to database
    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Error creating product',
      error: error.message
    });
  }
});

module.exports=router
