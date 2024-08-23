import { Router } from "express";
import Product from "../models/product.js";
import authMiddleware from '../middleware/auth.js';
import userMiddleware from '../middleware/user.js';

const router=Router();
router.get('/',async (req,res)=>{
    const product=await Product.find().lean();
    res.render('index',{
        title:"abiz | Izzat",
        product:product.reverse(),
        userId:req.userId ? req.userId.toString() : null,
    });
});

    router.get('/products',async (req,res)=>{
        const user=req.userId ? req.userId.toString() : null;
        const myProduct=await Product.find({user}).populate('user').lean();
        res.render('products',{
            title:"Products | abiz",
            myProduct:myProduct,
        });
    });
    
    router.get('/add',authMiddleware,(req,res)=>{
        res.render('add',{
            title:"Add Products",
            addProductsError:req.flash('addProductsError'),
        });
    });

router.get('/product/:id', async (req,res)=>{
    const id=req.params.id;
    const product=await Product.findById(id).populate('user').lean();
    res.render('product',{
        product:product,
    });
});
router.get('/edit-product/:id',async (req,res)=>{
    const id=req.params.id;
    const product=await Product.findById(id).populate('user').lean();
    res.render('edit-product',{
        product:product,
        editProductError:req.flash('editProductError'),
    });
});


    router.post('/add-products',userMiddleware,async (req,res)=>{
        const {title,description,image,price}=req.body;
        if(!title || !description || !image || !price){
            req.flash('addProductsError','All fields required!');
            res.redirect('/add');
            return;
        }
        await Product.create({...req.body,user:req.userId});
        res.redirect('/');
        
    });
router.post('/edit-product/:id',async (req,res)=>{
    const {title,description,image,price}=req.body;
    const id=req.params.id;
    if(!title || !description || !image || !price){
        req.flash('editProductError','All fields required!');
        res.redirect('/edit-product/${id}');
        return;
    }
    await Product.findByIdAndUpdate(id,req.body,{new:true});    
    res.redirect('/products');
    
});
router.post('/delete-product/:id',async (req,res)=>{
    const id=req.params.id;
    await Product.findByIdAndDelete(id);
    
    res.redirect('/');
    
});
    export default router;