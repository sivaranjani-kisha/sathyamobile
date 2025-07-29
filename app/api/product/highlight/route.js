import { NextResponse } from 'next/server';
import { join } from 'path';
import * as XLSX from 'xlsx';
import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import { format } from 'date-fns';
import { writeFile } from 'fs/promises';
import Product from "@/models/product";
import Category from  "@/models/ecom_category_info";
import Brand  from "@/models/ecom_brand_info";
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
 
    const formData = await req.formData();
    const excelFile = formData.get('excel');

    if (!excelFile) {
        return NextResponse.json(
        { error: 'Missing required files: Excel and Images ZIP are mandatory.' },
        { status: 400 }
        );
    }

    const allowedExtensions = [".xlsx", ".csv"];
    const fileName = excelFile.name.toLowerCase();
    if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
        return NextResponse.json(
        { error: "Invalid file type. Only .xlsx and .csv files are allowed." },
        { status: 400 }
        );
    }

    const uploadDir = join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Process Excel file
    const excelBuffer = Buffer.from(await excelFile.arrayBuffer());
    const workbook = XLSX.read(excelBuffer);
    const products = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    await writeFile(join(uploadDir, `uploaded-products_${timestamp}.xlsx`), excelBuffer);
    const validProducts = products.slice(1).filter(row => row && row.length > 0 && row[0]); 
    console.log("Actual product count:", validProducts.length);
    if (!validProducts || validProducts.length === 0) {
    return NextResponse.json(
        { error: "No products found in the uploaded Excel file." },
        { status: 400 }
    );
    }

    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
    }

    for (let i = 1; i < validProducts.length; i++) {
        const row = validProducts[i];

        const item_code = row[0];
        const product_highlight = row[1];

        if (!item_code || product_highlight === undefined) {
            return  NextResponse.json({ message: 'item_code and product_highlight are required' });
        }

            const existingProduct = await Product.findOne({
                $or: [
                    { item_code: item_code },
                ],
                });
        

        if (existingProduct) {
            try {
                let highlightObject;
            
                if (typeof product_highlight === 'string') {
                try {
                    highlightObject = JSON.parse(product_highlight);
                    if (typeof highlightObject !== 'object' || Array.isArray(highlightObject)) {
                    throw new Error('Invalid JSON structure');
                    }
                } catch (err) {
                    return  NextResponse.json({ message: 'Invalid JSON string provided for product_highlight',status:404 });
                }
                } else if (typeof product_highlight === 'object') {
                highlightObject = product_highlight;
                } else {
                return NextResponse.json({ message: 'product_highlight must be a JSON object or valid JSON string',status:404 });
                }
            
                const updated = await Product.findOneAndUpdate(
                { item_code },
                { product_highlight: highlightObject },
                { new: true }
                );
            
                if (!updated) {
                return res.status(404).json({ message: 'Product not found' });
                }
            
                return NextResponse.json({
                    message: `Successfully processed products.`,
                    productCount: updated.length ,
                    });
            
            } catch (error) {
                console.error('Error updating product highlight:', error);
                return res.status(500).json({ message: 'Server error' });
            }
        }
    }
}
 
 