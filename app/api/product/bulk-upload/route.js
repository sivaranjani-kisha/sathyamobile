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
  try {
    const formData = await req.formData();
    const excelFile = formData.get('excel');
    const imagesZip = formData.get('images');
    const overviewZip = formData.get('overview');

    if (!excelFile || !imagesZip) {
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

    // Process Images ZIP
    const imagesBuffer = Buffer.from(await imagesZip.arrayBuffer());
    const imagesZipInstance = new AdmZip(imagesBuffer);
    const imagesPath = join(uploadDir, 'products');
    
    // Get all zip entries
    const zipEntries = imagesZipInstance.getEntries();
    
    for (const entry of zipEntries) {
      // Skip directories
      if (entry.isDirectory) continue;
    
      // Only process files (e.g., images)
      const fileName = entry.entryName.split('/').pop(); // Remove internal folders
      const filePath = join(imagesPath, fileName);
    
      // Write file
      await fs.writeFile(filePath, entry.getData());
    }

    // Process Overview ZIP if exists
    if (overviewZip) {
      const overviewBuffer = Buffer.from(await overviewZip.arrayBuffer());
      const overviewZipInstance = new AdmZip(overviewBuffer);
      const overviewPath = join(uploadDir, 'overview-images');
      overviewZipInstance.extractAllTo(overviewPath, true);
    }
console.log("products.length ",products.length );
const validProducts = products.slice(1).filter(row => row && row.length > 0 && row[0]); // Skip header and empty rows
console.log("Actual product count:", validProducts.length);
    if (!validProducts || validProducts.length === 0) {
      return NextResponse.json(
        { error: "No products found in the uploaded Excel file." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    for (let i = 1; i < validProducts.length; i++) {
      const row = validProducts[i];
      
      // Process category and brand
      const category = await Category.findOne({ category_name: row[3] }).select("_id");
      const sub_category = await Category.findOne({ category_name: row[4] }).select("_id");
      const brand = await Brand.findOne({ brand_name: row[5] }).select("_id");

      // Process filters
      const size = row[6] || '';
      const star = row[7] || '';
      const filterString = `${size},${star}`;
      const filterNames = filterString.split(',')
        .map(name => name.trim())
        .filter(name => name !== '');
      
      let filterIds = [];
      let filters = []; // Changed from const to let
      if (filterNames.length > 0) {
        filters = await Filter.find({ filter_name: { $in: filterNames } }); // Ensure no status filter
        filterIds = filters.map(filter => filter._id.toString());
      }

      // Process images and variants
      const images = [row[13], row[14], row[15]].filter(img => img);
      let overviewImage = [];
      if (row[16]) overviewImage = row[16].split(',').filter(img => img);
      
      let variants = [];
      if (row[18] && row[18].trim() !== "") {
        try {
          variants = JSON.parse(row[18].trim());
          if (!Array.isArray(variants)) variants = [];
        } catch (error) {
          console.error(`Error parsing variants at row ${i + 1}: ${error.message}`);
          variants = [];
        }
      }
 // ✅ Price & Special Price with validation
      const rawPrice = row[9]?.toString().replace(/,/g, '') || '0';
      const rawSpecialPrice = row[10]?.toString().replace(/,/g, '') || '';

      const price = parseFloat(rawPrice);
      const specialPrice = parseFloat(rawSpecialPrice);

      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: `Invalid price at row ${i + 2}. Must be a positive number.` },
          { status: 400 }
        );
      }

      if (rawSpecialPrice !== '') {
        if (isNaN(specialPrice) || specialPrice < 0 || specialPrice >= price) {
          return NextResponse.json(
            { error: `Invalid special price at row ${i + 2}. It must be a positive number less than price.` },
            { status: 400 }
          );
        }
      }
      let highlights = [];
        if (row[20] && typeof row[20] === 'string') {
          highlights = row[20].split(',').map(item => item.trim()).filter(Boolean);
        }
      // Prepare product data
      const productData = {
        item_code: row[0],
        name: row[1],
        quantity: row[2],
        category: category?._id || null,
        sub_category: sub_category?._id || null,
        brand: brand?._id || null,
        price: row[9],
        special_price: row[10],
        description: row[11],
        key_specifications: row[12],
        images: images,
        overview_image: overviewImage,
        overview_description: row[17],
        hasVariants: variants.length > 0,
        variants: variants,
        status: row[19],
        stock_status: row[2] > 0 ? "In Stock" : "Out of Stock",
         product_highlights: highlights,
      };
console.log(productData);
      // Check for existing product
      const existingProduct = await Product.findOne({
        $or: [
          { item_code: productData.item_code },
          // { name: productData.name },
        ],
      });



      if (!existingProduct) {
        // Create new product
        const productSlug = productData.name.toLowerCase()
        .replace(/[^\w\s-]/g, '')        // Remove all non-word characters except spaces and hyphens
        .replace(/\s+/g, '-')            // Replace spaces with hyphens
        .replace(/--+/g, '-')            // Replace multiple hyphens with a single one
        .trim(); 
        productData.slug = productSlug;
        productData.md5_name = md5(productSlug);
        console.log(productData);
        const newProduct = await Product.create(productData);

        // Create product filters
        if (filterIds.length > 0) {
          await ProductFilter.insertMany(
            filterIds.map(filterId => ({
              product_id: newProduct._id,
              filter_id: filterId
            }))
          );
        }
      } else {
        // Update existing product
        await Product.updateOne(
          { _id: existingProduct._id },
          { $set: productData }
        );

        const existingProductFilters = await ProductFilter.find({ product_id: existingProduct._id });
        const existingFilterIds = existingProductFilters.map(pf => pf.filter_id.toString());

        const newFilterIds = filters.map(f => f._id.toString());

        // Remove associations not present in Excel
        await ProductFilter.deleteMany({
          product_id: existingProduct._id,
          filter_id: { $nin: newFilterIds }
        });

        // Add new associations
        const operations = newFilterIds
          .filter(id => !existingFilterIds.includes(id))
          .map(id => ({
            insertOne: {
              document: {
                product_id: existingProduct._id,
                filter_id: id
              }
            }
          }));

        if (operations.length > 0) {
          await ProductFilter.bulkWrite(operations, { ordered: false });
        }
      }
    }

    return NextResponse.json({
      message: `Successfully processed ${validProducts.length } products.`,
      productCount: validProducts.length ,
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload: ' + error.message },
      { status: 500 }
    );
  }
}