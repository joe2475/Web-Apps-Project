"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const userFavoriteSchema = new mongoose.Schema({
  user_id: String,
  photo_id: String,
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const UserFavorite = mongoose.model("UserFavorite", userFavoriteSchema);

/**
 * Make this available to our application.
 */
module.exports = UserFavorite;
