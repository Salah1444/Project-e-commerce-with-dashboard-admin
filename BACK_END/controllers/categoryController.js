import categoryModel from "../models/categoryModel.js";

export const addCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const image = req.file ? req.file.filename : null;
    const category = await categoryModel.create({ category: name, Image: image });
    res.json({ success: true, message: "Category added successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.deleteOne({ _id: id });
    res.json({ success: true, message: "Category deleted successfully", id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categorys = await categoryModel.find();
    res.json({ categorys });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};