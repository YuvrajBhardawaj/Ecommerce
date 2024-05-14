import mysql from 'mysql2';
import dotenv from 'dotenv';
import { v4 as uuid4 } from "uuid";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();
const JWT_SECRET = 'MyKey';

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

export async function addCart(cust_id, item_id, quantity, price) {
    try {
        // Check if inputs are valid
        if (!cust_id || !item_id || quantity <= 0 || price <= 0) {
            throw new Error('Invalid input data');
        }

        // Check if item is already in cart
        const [existingCartItem] = await pool.query("SELECT * FROM cart WHERE cust_id = ? AND item_id = ?", [cust_id, item_id]);

        if (existingCartItem.length > 0) {
            // If item is already in cart, update the quantity
            const updatedQuantity = existingCartItem[0].quantity + quantity;
            await pool.query("UPDATE cart SET quantity = ? WHERE cust_id = ? AND item_id = ?", [updatedQuantity, cust_id, item_id]);
            return { success: true, message: 'Item quantity updated in cart' };
        } else {
            // If item is not in cart, insert into cart
            const [result] = await pool.query("INSERT INTO cart (cust_id, item_id, quantity, price) VALUES (?, ?, ?, ?)", [cust_id, item_id, quantity, price]);
            // Check if insertion was successful
            if (result.affectedRows !== 1) {
                throw new Error('Failed to add item to cart');
            }
            return { success: true, message: 'Item added to cart successfully' };
        }
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        return { success: false, message: 'Failed to add item to cart' };
    }
}

export async function signUp(name, email, phone, address, password, gender) {
    // Check if any of the required fields are empty
    if (!name || !email || !phone || !address || !password || !gender) {
        throw new Error('All fields are required');
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email address');
    }

    // Check if phone number is valid (for simplicity, let's assume it should be a number with at least 10 digits)
    if (!/^\d{10,}$/.test(phone)) {
        throw new Error('Invalid phone number');
    }

    try {
        // Check if user with the same email already exists
        const [existingUser] = await pool.query("SELECT * FROM userinfo WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return { success: false, message: 'User with this email already exists' }
        }

        const id = uuid4();

        // Execute the database query to insert user info
        const [result] = await pool.query("INSERT INTO userinfo (id, name, gender, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)", [id, name, gender, email, password, phone, address]);
        if (result.affectedRows !== 1) {
            throw new Error('Failed to add user');
        }
        return {success:true, message:'User created'};
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, message: 'Failed to sign up' };
    }
}
export async function signIn(email, password,res) {
    // Check if email and password are provided
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email address');
    }

    try {
        // Fetch user with the provided email
        const [user] = await pool.query("SELECT * FROM userinfo WHERE email = ?", [email]);
        console.log(user)
        if (user.length === 0) {
            return { success: false, message: 'User with this email does not exist' };
        }

        // Check if the provided password matches the stored password
        if (user[0].password !== password) {
            return { success: false, message: 'Incorrect password' };
        }

        // User authenticated successfully
        const token = jwt.sign({ userId: user[0].id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry
        return { success: true, message: 'User authenticated', user: user[0] };
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, message: 'Failed to sign in' };
    }
}
