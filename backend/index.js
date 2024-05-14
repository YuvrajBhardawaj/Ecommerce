import express from "express";
import { addCart, signUp, signIn } from "./db.js";
import { verify } from "./auth.js"
import cookieParser from "cookie-parser";
const app=express()

app.use(express.json())
app.use(cookieParser());
//app.use(express.urlencoded({extended:true}))

app.post('/api/product/addCart',async(req,res)=>{
    const {item_id,quantity,price}=req.body
    const token=req.cookies.token
    const check=await verify(token)
    if(check.success){
        const data = await addCart("4nm21is215",item_id,quantity,price)
        res.send(data)
    }
    res.send({success:false, message:'Kindly signin inorder to add to cart'})
})
app.post('/api/signup',async(req,res)=>{
    const { name, email, phone, address, password, gender } = req.body
    const data = await signUp(name, email, phone, address, password, gender)
    res.send(data)
})
app.post('/api/login',async(req,res)=>{
    const { email, password } = req.body
    const data = await signIn(email,password,res)
    res.send(data)
})
app.get('/api/check',async(req,res)=>{
    const token=req.cookies.token
    const data=await verify(token)
    console.log(data)
    res.send(data)
})
app.delete('/api/signout', (req, res) => {
    // Clear the token cookie by setting an expired date
    res.clearCookie('token');
    res.send({ success: true, message: 'User signed out successfully' });
});

app.listen(3000,()=>{
    console.log("Server running at port 3000")
})