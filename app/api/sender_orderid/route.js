import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Order from '@/models/ecom_order_info';
import UserAddress from '@/models/ecom_user_address_info';
import User from '@/models/User';
import Payments from '@/models/ecom_payment_info';

export async function POST(request) {
  await connectDB();

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const [
    UserAddress,
      user,
      payment,
    ] = await Promise.all([
      UserAddress.findById(order.user_adddeliveryid).lean(),
      User.findById(order.user_id).lean(),
      Payments.findById(order.payment_id).lean(),
    ]);

    const orderDetails = Order.order_details;
    if (!user || !payment || !UserAddress) {
      return NextResponse.json({ message: 'Required order data not found' }, { status: 404 });
    }

    const orderDate = new Date(order.createdAt).toISOString().split('T')[0].replace(/-/g, '');

    // Split billing address
    const bAddress = order.order_deliveryaddress || '';
    const bline1 = bAddress.substring(0, 100);
    const bline2 = bAddress.substring(100, 200);
    const bline3 = bAddress.substring(200, 300);

    const paymentMode = payment.payment_mode === 'cash'
      ? 'COD'
      : payment.payment_mode === 'online'
      ? 'OnlinePayment'
      : payment.payment_mode;

    const payload = {
      Order: {
        Customer: {
          TitleName: '',
          FirstName: UserAddress.firstName || '',
          MiddleName: '',
          LastName: UserAddress.lastName || '',
          Gender: '',
          MobileNumber: UserAddress.phonenumber,
          EmailID: user.email,
          UIN: '',
          GSTIN: '',
          CustomerAddressLine1: bline1,
          CustomerAddressLine2: bline2 || '',
          CustomerAddressLine3: bline3 || '',
          CustomerCityName: UserAddress.city,
          CustomerStateName: UserAddress.state,
          CustomerStateGSTCode: '',
          Pincode: UserAddress.postCode,
          DOB: '',
          DOBDay: '',
          DOBMonth: '',
          DOBYear: ''
        },
        Header: {
          OrderDate: orderDate,
          OrderNumber: order.order_number,
          OrderLocation: order.pickup_type,
          CustomerCode: '1001',
          DeliveryAddressLine1: bline1,
          DeliveryAddressLine2: bline2 || '',
          DeliveryAddressLine3: bline3 || '',
          DeliveryCityName: UserAddress.city,
          DeliveryStateName: UserAddress.state,
          DeliveryPincode: UserAddress.postCode,
          TotalOrderValue: order.order_amount,
          OrderRemarks: paymentMode,
          SourceChannel: 'E-Com'
        },
        Items: {
            Item: orderDetails.map((item, index) => ({
                LineNumber: (index + 1).toString(),
                ItemCode: item.item_code,
                Quantity: item.quantity,
                Rate: item.price,
                DiscountAmount: '',
                LineRemarks: '',
                StockLocation: order.pickup_type
            }))
        },
        OtherCharges: {
          Charge: {
            ChargeDescription: 'Delivery',
            ChargeValue: '0.00',
            ChargeReference: ''
          }
        },
        Payments: {
          Payment: {
            PaymentMode: paymentMode,
            PaymentValue: order.order_amount,
            ModeType: '',
            PaymentReference: payment.payment_id || ''
          }
        }
      }
    };

    const apiUrl = 'http://35.154.234.137:1030/api/Mapp/EYWASO';
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await apiResponse.json();

    const updateData = {
      api_status: result.Status,
      api_reason: result.Message,
      order_status: result.Status === 'Success' ? 'Order Placed' : 'Failure',
      ...(result.Status === 'Success' && { order_POSid: result.DocNum })
    };

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    return NextResponse.json({
      status: result.Status || 'Error',
      message: result.Message || 'No response from API',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error sending order data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
