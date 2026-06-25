import villeModel from "../models/villeModel.js";

export const createVille = async (req, res) => {
  try {
    const { ville, ZIP } = req.body;
    await villeModel.create({ ville, ZIP });
    res.json({ success: true, message: "City added successfully", ville: { ville, ZIP } });
  } catch (error) {
    res.json({ success: false, message: error });
  }
};

export const getVille = async (req, res) => {
  try {
    const ville = await villeModel.find();
    res.json({ success: true, ville });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const deleteVille = async (req, res) => {
  try {
    await villeModel.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "City deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};