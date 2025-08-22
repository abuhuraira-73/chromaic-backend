// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product', // Reference the Product model
      default: [],
    },
    cart: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          images: { type: [String], required: true },
          price: { type: Number, required: true },
          salePrice: { type: Number, required: true },
          description: { type: String, required: true },
          quantity: { type: Number, required: true, default: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
