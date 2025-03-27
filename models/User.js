const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    required: true,
    enum: ['user', 'admin'],
    default: 'user'
  },
  username: {
    type: String,
    trim: true,
    default: function() {
      return this.email.split('@')[0];
    },
  },
  company: {
    type: String,
    trim: true,
    default: 'Company A',
  },
  phone: { 
    type: String,
    required: false,
    match: [/^(\+\d{1,3})?\d{10}$/, 'Invalid phone number (e.g., +1234567890 or 1234567890)'],
    default: '1234567890'
  },
  shippingAddress: {
    street: { 
      type: String, 
      required: [false, 'Street address is required'],
      default: '123 Main Street' 
    },
    city: { 
      type: String, 
      required: [false, 'City is required'],
      default: 'New York'
    },
    state: { 
      type: String, 
      required: [false, 'State/Province is required'],
      default: 'NY' 
    },
    postalCode: { 
      type: String, 
      required: [false, 'Postal code is required'],
      match: [/^[A-Za-z0-9\- ]+$/, 'Invalid postal code'],
      default: '10001' 
    },
    country: { 
      type: String, 
      required: [false, 'Country is required'], 
      default: 'US',
      enum: ['US', 'CA', 'UK', 'AU', 'DE']
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for full address
UserSchema.virtual('fullAddress').get(function() {
  const addr = this.shippingAddress;
  if (!addr) return '';
  
  const addressParts = [
    addr.street,
    `${addr.city}, ${addr.state} ${addr.postalCode}`,
    addr.country
  ];
  
  return addressParts.filter(Boolean).join('\n');
});

// Virtual property for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);