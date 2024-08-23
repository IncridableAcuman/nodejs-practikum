import { Router } from "express";
import bcrypt from 'bcrypt';
import { generateJWTToken } from "../services/token.js";
import User from "../models/user.js";
import authMiddleware2 from "../middleware/auth2.js";
const router=Router();

router.get('/login',authMiddleware2,(req,res)=>{
    
    res.render('login',{
        title:"Login | abiz",
        loginError:req.flash('loginError'),
    }); 
});
router.get('/register',authMiddleware2,(req,res)=>{
    
    res.render('register',{
        title:"Register | abiz",
        registerError:req.flash('registerError'),
    });
});
router.post('/login', async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        req.flash('loginError','Email or Password should be required!');
        res.redirect('/login');
        return ;
    }
    const existUser=await User.findOne({email:email});
    if(!existUser){
        req.flash('loginError','User not found');
        res.redirect('/login');
        return ;
    }
    const isPswdEquel=await bcrypt.compare(password,existUser.password);
    if(!isPswdEquel){
        req.flash('loginError','Password wrong');
        res.redirect('/login');
        return ;
    }
    const token=generateJWTToken(existUser._id);
    res.cookie('token',token,{secure:true});
    res.redirect('/');
});
router.post('/register', async (req,res)=>{
    const {firstname,lastname,email,password}=req.body;
    if(!firstname || !lastname || !email || !password){
        req.flash('registerError','All fields are required!');
        res.redirect('/register');
        return ;
    }
    const hashedPswd=await bcrypt.hash(password,10);
    const condidate=await User.findOne({email});
    if(condidate){
        req.flash('registerError','User already exist');
        res.redirect('/register');
        return ;   
    }
    const userData={
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:hashedPswd
    }
    
    const user=await User.create(userData);
    const token=generateJWTToken(user._id);
    res.cookie('token',token,{secure:true}); 
    res.redirect('/');
});
router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
});


export default router;