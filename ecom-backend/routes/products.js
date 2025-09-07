import express from 'express';
import Product  from '../models/Products.js';

const router = express.Router();


router.get('/',async(req,res)=>{
    try{
        const products = await Product.find().populate('category');
        res.json(products);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, password, email } = req.body;

        // Basic validation
        if (!name || !password || !email) {
            return res.status(400).json({ message: 'Please provide a name, email, and password.' });
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log('Returning existing user:', existingUser.name);
            return res.status(200).json(existingUser);
        }

        // If user does not exist, proceed to create a new one
        const encodedPassword = Buffer.from(password).toString('base64');

        const newUser = await User.create({
            name,
            email,
            password: encodedPassword
        });

        console.log('New user created:', newUser);
        res.status(201).json(newUser);

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "An error occurred on the server." });
    }
});

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
// --- GET /api/products - List all products with stock levels ---
router.get('/low-stock',async(req,res)=>{
    try{
        const lowstockproducts = await Product.find({stock_quantity:{$lt:10}}).populate('category');

        res.json(lowstockproducts);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});




export default router;
