import mongoose from "mongoose";

const OrderHistorySchema = new mongoose.Schema(
  {
  user_id:{ type: String, required: true},
  order_number:{ type: String, required: true},
  notify:{ type: Number,default:0},
  comment:{ type: String},
  order_status: {
    type: String,
  },

},

  { timestamps: true }
);

export default mongoose.models.ecom_orderhistory_info || mongoose.model("ecom_orderhistory_info", OrderHistorySchema);


