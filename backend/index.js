import express from "express";
import { verify } from "./auth.js"
import cookieParser from "cookie-parser";
import { getCategories, getProductById, getProducts, getCategoryByName, getReviews, loginUser, signUpUser, addCart, getCartItems, addToWishlist, removeFromWishlist, checkIfInWishlist, deleteCartItem, getWishlistItems, addReview, fetchUserDetails, addOrder } from "./database.js";

const app=express()
app.use(express.json())
app.use(cookieParser());
//app.use(express.urlencoded({extended:true}))
app.get('/api/categories',async(req,res)=>{
    const categories= await getCategories();
    if(categories.success)
        return res.status(200).send(categories)
    res.status(500).send(categories)
})
app.get('/api/products',async(req,res)=>{
    const products=await getProducts();
    if(products.success)
        return res.status(200).send(products)
    res.status(500).send(products)
})
app.get('/api/product/:productId', async (req, res) => {
    const { productId } = req.params;
    // Check if productId exists
    if (!productId) {
        return res.status(400).send({ success: false, error: 'Product ID is required' });
    }
    // Fetch the product by ID
    const product = await getProductById(productId);
    // Handle the response based on success or failure
    if (product.success) {
        return res.status(200).send(product);
    } else {
        return res.status(500).send(product);
    }
});

app.get('/api/category/:id', async (req, res) => {
    const categoryName = req.params.id;
    const category = await getCategoryByName(categoryName);
    if (category.success) 
        return res.status(200).json(category);
    res.status(404).json(category); 
});

app.post('/api/product/addCart',async(req,res)=>{
    const {item_id, title,quantity,price,image}=req.body
    const token=req.cookies.token
    const check=await verify(token)
    if(check.success){
        //console.log(check)
        const data = await addCart(check.id,item_id,title,quantity,price,image)
        return res.send(data)
    }
    res.send({success:false, message:'Kindly signin inorder to add to cart'})
})
app.post('/api/signup', async (req, res) => {
    const { name, email, phone, address, password, gender } = req.body;

    // Ensure all required fields are provided
    if (!name || !email || !phone || !address || !password || !gender) {
        return res.status(400).send({ success: false, message: 'All fields are required' });
    }

    try {
        // Call the signUpUser function
        const data = await signUpUser(email, password, name, phone, address, gender);

        // Send response back to the client
        if (data.success) {
                        // Respond with success message
            res.status(201).send({ success: true, message: 'Sign-up successful', userId: data.userId });
        } else {
            // If something went wrong, send error message
            res.status(400).send({ success: false, message: data.message });
        }
    } catch (error) {
        // Catch any unexpected errors and return a 500 error response
        console.error('Error during sign-up:', error.message);
        res.status(500).send({ success: false, message: 'Sign-up failed' });
    }
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Ensure both email and password are provided
    if (!email || !password) {
        return res.status(400).send({ success: false, message: 'Email and password are required' });
    }

    // Call the loginUser function
    const data = await loginUser(email, password);
    // Send response back to the client
    if (data.success) {
        // Optional: Set cookie or send token
        res.cookie('token', data.token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).send({ success: true, message: 'Login successful'});
    } else {
        res.status(400).send({ success: false, message: data.message });
    }
});
app.get('/api/check',async(req,res)=>{
    const token=req.cookies.token
    const data=await verify(token)
    res.send(data)
})
app.delete('/api/signout', (req, res) => {
    // Clear the token cookie by setting an expired date
    res.clearCookie('token');
    res.send({ success: true, message: 'User signed out successfully' });
});
app.post('/api/reviews',async(req,res)=>{
    const token=req.cookies.token
    const data=await verify(token)
    if(data.success){
        const {item_id,review} = req.body
        const result = await addReview(data.id, item_id, review)
        return res.send(result)
    }
    res.send({success:false, message:'Kindly signin inorder to add to reviews'})
})
app.get('/api/reviews/:id',async(req,res)=>{
    const {id} = req.params
    const data = await getReviews(id)
    //console.log(data)
    res.send(data)
})
app.get('/api/cart', async (req, res) => {
    const token = req.cookies.token;
    const check = await verify(token);

    if (check.success) {
        try {
            const userId = check.id;
            const data = await getCartItems(userId); // Fetch cart items
            if (data.success)
                res.send(data); // Send the cart items
        } catch (error) {
            console.error('Error in /api/cart route:', error);
            res.status(500).send({ success: false, message: 'Internal server error' });
        }
    } else
        res.status(401).send({ success: false, message: 'Kindly sign in to view cart' });
});
app.post('/api/product/addWishlist', async (req, res) => {
    const { item_id, title, price, image } = req.body;
    const token = req.cookies.token;
    const check = await verify(token);

    if (check.success) {
        const result = await addToWishlist(check.id, item_id, title, price, image);
        return res.send(result);
    }
    res.send({ success: false, message: 'Kindly sign in to add to wishlist' });
});
app.post('/api/product/removeWishlist', async (req, res) => {
    const { item_id } = req.body;
    const token = req.cookies.token;
    const check = await verify(token);
    if (check.success) {
        const result = await removeFromWishlist(check.id, item_id);
        return res.send(result);
    }
    res.send({ success: false, message: 'Kindly sign in to remove from wishlist' });
});
app.get('/api/wishlist/check/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const token = req.cookies.token;
    const check = await verify(token);

    if (check.success) {
        const isInWishlist = await checkIfInWishlist(check.id, item_id);
        return res.send({ success: true, isInWishlist });
    }
    res.send({ success: false, message: 'Kindly sign in to check wishlist' });
});
app.delete('/api/cart/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const token = req.cookies.token;
    const check = await verify(token);
    
    if (check.success) {
        // If the token is valid, proceed to delete the cart item
        const result = await deleteCartItem(check.id, itemId);
        return res.send(result);
    }
    // If token is invalid or user is not signed in
    res.send({ success: false, message: 'Kindly sign in to remove item from cart' });
});
app.get('/api/wishlist', async (req, res) => {
    try {
        const token = req.cookies.token;
        const check = await verify(token);

        if (check.success) {
            // Fetch the wishlist data for the authenticated user
            const result = await getWishlistItems(check.id);

            if (result.success) 
                return res.send({ success: true, wishlist: result.wishlistItems });
            return res.status(500).send({ success: false, message: 'Failed to retrieve wishlist data' });
        }

        // If the token is invalid or the user is not authenticated
        res.status(401).send({ success: false, message: 'Unauthorized access, please sign in' });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).send({ success: false, message: 'Server error while fetching wishlist' });
    }
});
app.get('/api/userDetails', async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token)
            return res.send({success:false, message:"Please login first"})
        const check = await verify(token);

        if (check.success) {
            // Fetch user details from Firestore
            const result = await fetchUserDetails(check.id);

            // Check the result and send an appropriate response
            if (result.success) {
                res.status(200).send({
                    success: true,
                    user: {
                        name: result.name,
                        phone: result.phone,
                        address: result.address
                    }
                });
            } else 
                res.status(404).send({success: false,message: result.message});

        } else {
            res.status(401).send({success: false,message: 'Unauthorized: Invalid token'});
        }
    } catch (error) {
        console.error('Error handling /api/userDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});
app.post('/api/checkout', async (req, res) => {
    try {
        // Get the token from cookies
        const token = req.cookies.token;
        
        // Verify the token
        const check = await verify(token);

        // Add order to Firestore using the verified user ID
        const orderDetails = req.body;
        const result = await addOrder(check.id, orderDetails);

        if (result.success) {
            return res.status(200).send({ success: true, message: 'Order placed successfully', orderId: result.orderId });
        } else {
            return res.status(500).send({ success: false, message: 'Failed to place the order' });
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

app.listen(3000,()=>{
    console.log("Server running at port 3000")
})