import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Orderhistory from "@/models/ecom_orderhistory_info";
import Order from "@/models/ecom_order_info";


/** POST - Add to Cart **/
export async function POST(request) {
  try {
    await connectDB();
   const { orderId } = await request.json();
  
      if (!orderId) {
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
      }
  
      const order = await Order.findById(orderId).lean();
      if (!order) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }

      const orderhistory = new Orderhistory({
        user_id:order.user_id,
        order_number:order.order_number,
        order_status:"Pending"
      });


    await orderhistory.save();

    return NextResponse.json(
      {
        message: "order history saved",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST  error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


/** PUT - Update Quantity **/
export async function PUT(req) {
  try {
    await connectDB();
    const { orderId, status } = await req.json();
    if (!orderId || status) {
      return NextResponse.json({ error: "orderId,status required" }, { status: 400 });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "order not found" }, { status: 404 });
    }

      const orderhistory = new Orderhistory({
        user_id:order.user_id,
        order_number:order.order_number,
        order_status:status
      });


    await orderhistory.save();


    return NextResponse.json(
      {
        message: "order history updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

