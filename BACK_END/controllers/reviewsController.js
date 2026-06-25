import reviewsModel from "../models/reviewsModel.js";
import userModel from "../models/userModel.js";
import productsModel from "../models/productsModel.js";

export const getReviews = async (req, res) => {
  const product = req.params.id;

  try {
    const reviews = await reviewsModel
      .find({ product })
      .populate("user", "FullName Email");
    res.json({ success: true, reviews });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addReview = async (req, res) => {
  const { comment } = req.body;
  const { product } = req.params;
  const userId = req.user.user;

  const rating = 1;
  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const re = await reviewsModel.create({
      rating,
      comment,
      user: userId,
      product,
    });

    const reviews = await reviewsModel.find({ product });
    const averageRating = reviews.length
      ? Number(
          (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;
    await productsModel.findByIdAndUpdate(product, { rating: averageRating });

    res.json({
      success: true,
      message: "Your comment added successfully",
      review: re,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const updateReviewRating = async (req, res) => {
  const { rating } = req.body;
  const { id } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5" });
  }

  try {
    const review = await reviewsModel.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const reviews = await reviewsModel.find({ product: review.product });
    const averageRating = reviews.length
      ? Number(
          (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

    await productsModel.findByIdAndUpdate(review.product, {
      rating: averageRating,
    });

    res.json({
      success: true,
      message: "Review rating updated successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};