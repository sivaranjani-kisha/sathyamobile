import { NextResponse } from 'next/server';
import { join } from 'path';
import path from 'path';
import * as XLSX from 'xlsx';
import AdmZip from 'adm-zip';
import fs from 'fs';
import { format } from 'date-fns';
import { writeFile } from 'fs/promises';
import Product from "@/models/product";
import Brand from "@/models/ecom_brand_info";
import Product_all from "@/models/Product_all";
import Category from  "@/models/ecom_category_info";
//import Brand  from "@/models/ecom_brand_info";
import md5 from "md5";
import mongoose from 'mongoose';
import Filter from "@/models/ecom_filter_infos";
import ProductFilter from "@/models/ecom_productfilter_info";

export const config = {
    api: {
      bodyParser: false,
    },
  };

export async function POST(req) {
  try {
    const body = await req.json();
    // const stockItems = body.stock;
     const stockItems = body.sku;

    if (!Array.isArray(stockItems)) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'allstock');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    const filename = `stock_${Date.now()}.json`;
    fs.writeFileSync(path.join(filePath, filename), JSON.stringify(body, null, 2));

    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
    }

    for (const item of stockItems) {
        const existingProduct = await Product.findOne({
            item_code: item.item_code,
        });
        const existingBrand = await Brand.findOne({
        brand_name: item.brand,
        });
        const existingName=item.item_description || '';
        let brand_id = null;
        if(existingBrand){
         brand_id = existingBrand._id.toString();
        }
        //  const normalizedStatus = (item.Status || '').trim().toLowerCase() === 'inactive' ? 'Inactive' : 'Active';
        let Status = "Active";
        if(item.Status !="" ){
          if(item.Status === "InActive"){
            Status  = 'Inactive';
          }
        }
        if (existingProduct) {
          if(brand_id==null){
            brand_id = existingProduct.brand;
          }
            await Product.updateOne(
                {
                 item_code: item.item_code 
                },
                {
                    $set: {
                        price: parseFloat(item.price),
                        special_price: parseFloat(item.spl_price),
                        quantity: parseFloat(item.quantity),
                        status :Status,
                        brand:brand_id,
                        name:existingName,
                    },
                }
                
            );
        }else{
            const existingProductall = await Product_all.findOne({
                item_code: item.item_code,
            });
            let existingProductall_brand_id = null;
             
            if(existingBrand){
            existingProductall_brand_id = existingBrand._id.toString();
            }
           const existingName=item.item_description;
            if (existingProductall) {
              const existingName=item.item_description;
              if(existingProductall_brand_id==null){
               existingProductall_brand_id = existingProductall.brand;
              }
                await Product_all.updateOne(
                    {
                    item_code: item.item_code 
                    },
                    {
                        $set: {
                            price: parseFloat(item.price),
                            special_price: parseFloat(item.spl_price),
                            quantity: parseFloat(item.quantity),
                            brand:existingProductall_brand_id,
                            name:existingName,
                        },
                    }
                    
                );
            }else{
                await Product_all.create({
                    item_code: item.item_code,
                    price: parseFloat(item.price),
                    special_price: parseFloat(item.spl_price),
                    quantity: parseFloat(item.quantity),
                    //brand:existingProductall_brand_id,
                    brand:item.brand,
                    name:existingName,
                });

            }

        }
    }


    return NextResponse.json({
      message: 'Stock items processed successfully',
    });
  } catch (error) {
    console.error('Sap Items Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload: ' + error.message },
      { status: 500 }
    );
  }
}