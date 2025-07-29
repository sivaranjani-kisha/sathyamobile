import mongoose from "mongoose";

const ProductallSchema = new mongoose.Schema({
  item_code: String,
  name: String,
  price: Number,
  final_price: Number,
  special_price: Number,
  quantity: Number,
  brand: String,
  store_price: { type: Number },
  brand_code:{ type: String },
  movement: { type: String },
  rank:{ type: Number },
  ean:{ type: String },
  indoor_ean:{ type: String },
  common_item_code:{ type: String },
  id_spl_price:{ type: Number },
  id_final_price:{ type: Number },
  id_price:{ type: Number },
  id_store_price:{ type: Number },
  item_description:{ type: String },
  group_property:{type:String},
  bfl_id: { type: String },
  ean:{ type: String },
  is_common_type: { type: Number },
  common_item_code:{ type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },


 
});

export default mongoose.models.Product_all || mongoose.model("Product_all", ProductallSchema);
