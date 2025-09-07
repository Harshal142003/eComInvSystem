import express from 'express';
import Product  from '../models/Categories.js';
import Category from '../models/Categories.js';

const router = express.Router();


router.get('/',async(req,res)=>{
    try{
        const products = await Category.find();
        res.json(products);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});



router.post('/',async(req,res)=>{

    const {name,description} = req.body;
    try{

        const newCategory = new Category({name,description});
        const addCategory = await newCategory.save();
        res.status(201).json(addCategory);
    }catch(err){
        res.status(500).json({message:err.message});
    }

});
export default router;
