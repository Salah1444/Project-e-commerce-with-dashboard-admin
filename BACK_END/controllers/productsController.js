import productsModel from "../models/productsModel.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import reviewsModel from "../models/reviewsModel.js";

// Helper — keeps category shape consistent across all responses
const formatProduct = (productDoc) => {
  const obj = productDoc.toJSON ? productDoc.toJSON() : productDoc;

  if (obj.category && typeof obj.category === "object") {
    obj.category = {
      _id: obj.category._id,
      name: obj.category.category,
    };
  } else {
    obj.category = null;
  }

  return obj;
};

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 20;

    let query = productsModel.find();
    let totalProducts = 0;

    if (page) {
      totalProducts = await productsModel.countDocuments();
      query = query.skip((page - 1) * limit).limit(limit);
    }
    let products = await query.populate("category");
    const formatted = products.map((product) => {
      const obj = formatProduct(product);
      if (obj.reviews) {
        obj.reviews = obj.reviews.map((rev) => ({
          ...rev,
          reviewerName: rev.user?.FullName ?? "Unknown User",
          reviewerEmail: rev.user?.Email ?? "Unknown Email",
          user: rev.user?._id ?? null,
        }));
      }

      return obj;
    });

    if (page) {
      res.json({
        success: true,
        products: formatted,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        totalProducts
      });
    } else {
      res.json({ success: true, products: formatted });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
export const getProductById = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await productsModel.findById(id).populate("category");
    const reviews = await reviewsModel.find({ product: id }).populate("user", "FullName Email");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const formatted = formatProduct(product);
    console.log("Fetched product:", formatted,reviews);
    res.json({ success: true, product: formatted, reviews});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, stock, category, description, brand, warranty, sku, rating } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    // Validate category ObjectId before inserting
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    const createdData = {
      name,
      price,
      stock,
      category,
      description,
      brand,
      warranty,
      sku,
      image,
    };
    if (rating !== undefined && rating !== "") {
      createdData.rating = Number(rating);
    }

    const created = await productsModel.create(createdData);

    // Populate so Redux gets the full { _id, name } shape immediately
    const populated = await productsModel
      .findById(created._id)
      .populate("category");

    res.status(201).json({ success: true, product: formatProduct(populated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category, description, brand, warranty, sku, rating } = req.body;

  try {
    // Validate category ObjectId — this is what caused your original CastError
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock; // stock can be 0, don't use falsy check
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (brand) updateData.brand = brand;
    if (warranty) updateData.warranty = warranty;
    if (sku) updateData.sku = sku;
    if (rating !== undefined && rating !== "") {
      updateData.rating = Number(rating);
    }

    if (req.file) {
      updateData.image = req.file.filename;

      // Delete old image file
      const oldProduct = await productsModel.findById(id);
      if (oldProduct?.image) {
        const oldImagePath = path.join(process.cwd(), "uploads", "products", oldProduct.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    const updated = await productsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("category"); // ✅ populate so response matches frontend shape

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: formatProduct(updated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await productsModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (deleted.image) {
      const imagePath = path.join(process.cwd(), "uploads", "products", deleted.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};