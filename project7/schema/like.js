"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const userLikeSchema = new mongoose.Schema({
  user_id: String,
  photo_id: String,
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const UserLike = mongoose.model("UserLike", userLikeSchema);

/**
 * Make this available to our application.
 */
module.exports = UserLike;
