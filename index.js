import express from 'express';
import { engine ,create} from 'express-handlebars';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import varMiddleware from './middleware/var.js';
import AuthRoutes from './routes/auth.js';
import hbsHelper from './utils/index.js';
import ProductsRoutes from './routes/products.js';
import userMiddleware from './middleware/user.js';
const hbs=create({defaultLayout:'main',extname:'hbs',helpers:hbsHelper});
const app=express();
dotenv.config();
app.engine('hbs',hbs.engine);
app.set('view engine','hbs');
app.set('views','./views');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(userMiddleware);
app.use(varMiddleware);
app.use(flash())
app.use(session({secret:'Izzatbek',resave:false,saveUninitialized:false}))
app.use(AuthRoutes);
app.use(ProductsRoutes);
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDBga ulanish hosil qilindi...");
})
.catch((error)=>{
    console.log("MongoDBga ulanish paytida xatolik yuz berdi",error);
}); 

const port = process.env.PORT || 5500;
app.listen(port,()=>{console.log(`Server is running on ${port} port...`)});
