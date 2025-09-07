import express from 'express';
import Product  from '../models/Products.js';

const router = express.Router();

//GET PRODUCTS
router.get('/',async(req,res)=>{
    try{
        const products = await Product.find().populate('category');
        res.json(products);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// ADD PRODUCTS
router.post("/", async (req, res) => {
  try {
    // If array → insertMany, else save one
    if (Array.isArray(req.body)) {
      const products = await Product.insertMany(req.body);
      res.status(201).json(products);
    } else {
      const { name, sku, price, stock_quantity, category } = req.body;
      const product = new Product({
        name,
        sku,
        price,
        stock_quantity,
        category,
      });
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//UPDATE PRODUCT
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find product
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Allowed fields to update
    const allowedFields = ['name', 'sku', 'price', 'stock_quantity', 'category_id'];

    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field) && updates[field] != null) {

        // Add to existing stock
        if (field === 'stock_quantity') {
          if (updates[field] < 0) {
            return res.status(400).json({ message: "stock_quantity cannot be negative" });
          }
          product.stock_quantity = updates[field];
        }

        // Validate category before updating
        if (field === 'category_id') {
          const categoryExists = await Category.findById(updates[field]);
          if (!categoryExists) {
            return res.status(400).json({ message: "Category not found with given category_id" });
          }
          product.category = updates[field];
        }

        // Normal update for other fields
        if (field === 'name' || field === 'sku' || field === 'price') {
          product[field] = updates[field];
        }
      }
    }



    // Save updated product
    const updatedProduct = await product.save();
    console.log("upatedProduct"+updatedProduct);

    res.status(200).json(updatedProduct);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// --- GET /api/products - List all products with stock levels 
router.get('/low-stock',async(req,res)=>{
    try{
        const lowstockproducts = await Product.find({stock_quantity:{$lt:10}}).populate('category');

        res.json(lowstockproducts);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

export default router;
