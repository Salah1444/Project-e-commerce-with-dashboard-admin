import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["new_order", "low_stock", "contact_message"],
      required: true,
    },
    message: { type: String, required: true },
    url: { type: String },               // lien vers la ressource concernée
    data: { type: Object },               // infos supplémentaires (orderId, produitId...)
    read: { type: Boolean, default: false },
    user: {                               // destinataire (admin)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;