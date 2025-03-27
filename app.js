require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const ejsLayouts = require('express-ejs-layouts');
const app = express();

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Inserting Defaults
// const {Category} = require('./models/Category');
// Category.initializeDefaults().catch(console.error);

const initializeProducts = require('./initials/initializeProducts');
initializeProducts();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS & Layouts
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Flash Messages (for errors/success)
app.use(flash());

// Global variables for messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
});

app.use((req, res, next) => {
    res.locals.originalUrl = req.originalUrl;
    res.locals.url = req.url; 
    next();
});

//middlewares
const fetchCart = require("./middlewares/cartMiddleware");
app.use(fetchCart);


// Routes
const indexRoutes = require("./routes/index");
const productRoutes=require("./routes/product")
const categoryRoutes=require("./routes/category")
const wishlistRoutes=require("./routes/wishlist")
const cartRoutes=require("./routes/cart")
const checkoutRoutes=require("./routes/checkout")
const orderRoutes=require("./routes/order");


app.use('/', indexRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/wishlist", wishlistRoutes);
app.use('/cart',cartRoutes)
app.use('/checkout',checkoutRoutes)

//apis
const authRoutes=require("./routes/api/auth")
const searchRoutes = require("./routes/search");

app.use('/api/user',authRoutes)
app.use('/account',authRoutes)
app.use('/api/wishlist',wishlistRoutes)
app.use('/api/cart',cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/search", searchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);


// All other routes (404 - Not Found)
app.use((req, res) => {
    res.status(404).render("404", { title: "404 - Page Not Found",bodyId:"page-404",bodyClass:"blog" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0',() => console.log(`Server running on port: ${PORT}`));