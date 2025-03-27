# 🛋️ FurniCraft - Modern Furniture E-Commerce Platform

![FurniCraft Screenshot](/public/snapshot/landing1.png)

A full-featured furniture store built with Node.js, Express, MongoDB, and Bootstrap. Includes product catalog, cart functionality, and PayPal integration.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB instance
- PayPal Developer account (for sandbox testing)

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/furnicraft.git
cd furnicraft

# Install dependencies
npm install

# Set environment variables (create .env file)
cp .env.example .env
```
## Environment Variables
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/furnicraft
PORT=3000
SESSION_SECRET=your_session_secret_here
PAYPAL_CLIENT_ID=your_paypal_client_id
NODE_ENV=development
```

# Test Credentials

| Role     | Email               | Password  |
|----------|---------------------|----------|
| Admin    | admin@example.com   | Pass1234 |
| Customer | user@example.com    | Pass1234 |

## 🛠️ Development
### Run in development mode
```bash
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment
### Docker
```bash
docker build -t furnicraft .
docker run -p 3000:3000 -d furnicraft
```
### Fly.io
```bash
flyctl launch
flyctl deploy
```
# Key Features

- **User Authentication** (Login/Register)  
- **Product Management** (CRUD Operations)  
- **Shopping Cart** (LocalStorage + DB sync)  
- **PayPal Integration** (Sandbox Mode)  
- **Responsive Design** (Mobile-first)  

## 📊 Database Schema  
**Database Schema**  

## 🛒 API Endpoints  

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/api/user/register`  | Register a new user         |
| POST   | `/api/user/login`     | Login user                  |
| GET    | `/api/user/check-auth` | Check if user is authenticated |
| GET    | `/api/user/logout`    | Logout user                 |
| POST   | `/api/orders`         | Create new order            |
| GET    | `/api/users/orders`   | Get user order history      |
| GET    | `/api/products`       | List all products           |
| GET    | `/api/categories`     | List all categories         |
| GET    | `/api/search`         | Search functionality        |
| POST   | `/api/wishlist`       | Add item to wishlist        |
| GET    | `/api/wishlist`       | Get wishlist items          |
| POST   | `/api/cart`           | Add item to cart            |
| GET    | `/api/cart`           | Get cart items              |



## 📝 License  
**MIT License** - See `LICENSE` for details.  

## 🙏 Acknowledgments  

- **Bootstrap 5** for UI components  
- **PayPal Node.js SDK** for payment processing  
- **MongoDB Atlas** for cloud database hosting  
