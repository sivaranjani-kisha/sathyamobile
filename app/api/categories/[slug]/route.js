import dbConnect from "@/lib/db";
import ecom_category_info from "@/models/ecom_category_info";
import Product from "@/models/product";
import ProductFilter from "@/models/ecom_productfilter_info";
import Brand from "@/models/ecom_brand_info"; 
import Filter from "@/models/ecom_filter_infos";
import FilterGroup from "@/models/ecom_filter_group_infos";

async function getCategoryTree(parentId) {
  const categories = await ecom_category_info.find({ parentid: parentId }).lean();
  
  for (const category of categories) {
    // Recursively fetch subcategories and assign directly to the category object
    category.subCategories = await getCategoryTree(category._id);
  }
  
  return categories;
}


export async function GET(request, { params }) {
  try {
    await dbConnect();

  const { slug } = await params;
    
    // Fetch main category
    const main_category = await ecom_category_info.findOne({ category_slug: slug });
    if (!main_category) {
      return Response.json({ error: "Main Category not found" }, { status: 404 });
    }

    // Get full category tree
    const categoryTree = await getCategoryTree(main_category._id);
    
    function getAllCategoryIds(categories) {
      return categories.reduce((acc, category) => {
        acc.push(category._id);
        console.log(category.subCategories);
        if (category.subCategories?.length > 0) {
      
          acc.push(...getAllCategoryIds(category.subCategories));
        }
        return acc;
      }, []);
    }
    
    // In your GET handler
    const allCategoryIds = getAllCategoryIds(categoryTree);
    const products = await Product.find({
      sub_category: { $in: allCategoryIds },
      status: "Active"
    });
    console.log(allCategoryIds);
    if (!products || products.length === 0) {
      return Response.json({ category:categoryTree, products: [], brands: [], filters: [] });
    }
    
    // Extract unique brand IDs from products
const brandIds = [...new Set(
  products
    .map(product => product.brand)
    .filter(brandId => brandId) // removes undefined, null, and empty strings
)];

const brands = await Brand.find({ _id: { $in: brandIds } });
    
    // Extract product IDs for filtering
    const productIds = products.map(product => product._id);
    const productFilters = await ProductFilter.find({ product_id: { $in: productIds } });
    
    // Extract unique filter IDs
    const filterIds = [...new Set(productFilters.map(pf => pf.filter_id))];
    const filters = await Filter.find({ _id: { $in: filterIds } }).populate({
            path: 'filter_group',
            select: 'filtergroup_name -_id',
            model: FilterGroup
          })
          .lean();
    // Add filter_group_name to filters
    const enrichedFilters = filters.map(filter => ({
        ...filter,
        filtergroup_name: filter.filter_group?.filtergroup_name || "Unknown"
      }));

      const formattedFilters = filters.map(filter => ({
        ...filter,
        filter_group_name: filter.filter_group?.filtergroup_name || 'No Group',
        filter_group: filter.filter_group?._id // Keep original ID
      }));
    return Response.json({ category:categoryTree,allCategoryIds, products, brands, filters: formattedFilters,main_category });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching category details" }, { status: 500 });
  }
}
