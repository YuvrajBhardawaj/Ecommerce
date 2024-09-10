import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import jwt from "jsonwebtoken";
const JWT_SECRET = "MyKey";
const firebaseConfig = {
    apiKey: "AIzaSyDQxVHMyU_3oqxO85rKNmUnD1I8KUbcz2g",
    authDomain: "e-commerce-1b583.firebaseapp.com",
    databaseURL: "https://e-commerce-1b583-default-rtdb.firebaseio.com",
    projectId: "e-commerce-1b583",
    storageBucket: "e-commerce-1b583.appspot.com",
    messagingSenderId: "582158425419",
    appId: "1:582158425419:web:1965de8f108fc2a28bdcce",
    measurementId: "G-0HY9L9HW8T"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
export async function getCategories() {
    try {
        const collectionRef = collection(db, 'categories');
        const querySnapshot = await getDocs(collectionRef);
        
        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return {success:true,data:categories}
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {success:false,error:'Failed to fetch categories'}
    }
}
export async function getProducts() {
    try {
        const collectionRef = collection(db, 'products');
        const querySnapshot = await getDocs(collectionRef);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: 'Failed to fetch products' };
    }
}
export async function getProductById(productId) {
    try {
        // Ensure productId is a string
        if (typeof productId !== 'string') {
            throw new TypeError('Product ID must be a string');
        }

        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { success: false, error: 'Product not found' };
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: 'Failed to fetch product' };
    }
}

export async function getCategoryByName(categoryName) {
    try {
        const collectionRef = collection(db, 'products');
        const q = query(collectionRef, where('category', '==', categoryName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { success: true, data: products };
        } else {
            return { success: false, error: 'No products found for this category' };
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: 'Failed to fetch products' };
    }
}
export async function getReviews(productId) {
    try {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        const reviewsCollectionRef = collection(db, `products/${productId}/review`);
        const reviewsQuery = query(reviewsCollectionRef);
        const querySnapshot = await getDocs(reviewsQuery);

        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (reviews.length === 0) {
            return { success: true, message: 'No reviews found for this product', reviews: [] };
        }

        return { success: true, reviews: reviews };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, message: 'Failed to fetch reviews' };
    }
}
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Create JWT token for the user
        const token = jwt.sign({ userId: user.uid }, JWT_SECRET, { expiresIn: '1h' });

        // Return the JWT token to the calling function
        return { success: true, token };
    } catch (error) {
        if (error.code === 'auth/user-not-found') 
            return { success: false, message: 'User with this email does not exist' };
        else 
            return { success: false, message: error.message };
    }
}
export async function signUpUser(email, password, name, phone, address, gender) {
    try {
        // Step 1: Sign up the user with email and password using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userId = user.uid;

        // Step 2: Store additional user details in Firestore under 'users' collection
        await setDoc(doc(db, "users", userId), {
            email: email,
            name: name,
            phone: phone,
            address: address,
            gender: gender,
            createdAt: new Date()
        });
        await setDoc(doc(db, `users/${userId}/wishlist`, "wishlistPlaceholder"), {});
        await setDoc(doc(db, `users/${userId}/cart`, "cartPlaceholder"), {});
        await setDoc(doc(db, `users/${userId}/orders`, "ordersPlaceholder"), {});
        console.log("User signed up and additional details stored successfully");
        return { success: true, message: "User signed up and details stored successfully" };
    } catch (error) {
        console.error("Error during sign up:", error.message);
        return { success: false, message: error.message };
    }
}
export async function addCart(userId, itemId, title, quantity, price, image) {
    try {
        // Reference to the user's cart document
        const cartDocRef = doc(db, `users/${userId}/cart`, itemId);

        // Check if the item already exists in the cart
        const cartDoc = await getDoc(cartDocRef);

        if (cartDoc.exists()) {
            // If the item exists, increment the quantity
            const existingData = cartDoc.data();
            const newQuantity = existingData.quantity + quantity;

            // Update the quantity
            await updateDoc(cartDocRef, {
                quantity: newQuantity,
                updatedAt: new Date(), // Optional: Track when the item was updated
            });

            return { success: true, message: 'Cart quantity updated successfully' };
        } else {
            // If the item doesn't exist, add it to the cart
            await setDoc(cartDocRef, {
                title: title,
                image: image,
                quantity: quantity,
                price: price,
                addedAt: new Date(), // Optional: Track when the item was added to the cart
            });

            return { success: true, message: 'Item added to cart successfully' };
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return { success: false, message: 'Failed to add item to cart' };
    }
}
export async function getCartItems(userId){
    try {
        // Reference to the user's cart collection
        const cartRef = collection(db, `users/${userId}/cart`);

        // Fetch all cart items
        const querySnapshot = await getDocs(cartRef);
        
        // Filter out the item you want to exclude (e.g., cartPlaceholder)
        const cartItems = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() })) // Convert docs to objects
            .filter(item => item.id !== 'cartPlaceholder'); // Exclude cartPlaceholder
        
        return({ success: true, cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return({ success: false, message: 'Failed to fetch cart items' });
    }
}
export async function addToWishlist(userId, itemId, title, price, image) {
    try {
        const wishlistRef = doc(db, `users/${userId}/wishlist`, itemId);
        await setDoc(wishlistRef, { title, price, image, addedAt: new Date() });
        return { success: true, message: 'Item added to wishlist successfully' };
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        return { success: false, message: 'Failed to add item to wishlist' };
    }
}
export async function removeFromWishlist(userId, itemId) {
    try {
        const wishlistRef = doc(db, `users/${userId}/wishlist`, itemId);
        await deleteDoc(wishlistRef);
        return { success: true, message: 'Item removed from wishlist successfully' };
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        return { success: false, message: 'Failed to remove item from wishlist' };
    }
}
export async function checkIfInWishlist(userId, itemId) {
    try {
        const wishlistRef = doc(db, `users/${userId}/wishlist`, itemId);
        const docSnap = await getDoc(wishlistRef);
        return docSnap.exists();
    } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
    }
}
export async function deleteCartItem(userId, itemId) {
    try {
        // Reference to the cart item document in Firestore
        const cartItemRef = doc(db, `users/${userId}/cart`, itemId);

        // Delete the document
        await deleteDoc(cartItemRef);

        return { success: true, message: 'Item removed from cart successfully' };
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return { success: false, message: 'Failed to remove item from cart' };
    }
}
export async function getWishlistItems(userId) {
    try {
        // Reference to the user's wishlist collection
        const wishlistRef = collection(db, `users/${userId}/wishlist`);

        // Fetch all wishlist items
        const querySnapshot = await getDocs(wishlistRef);
        
        // Filter out the item you want to exclude (e.g., wishlistPlaceholder)
        const wishlistItems = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() })) // Convert docs to objects
            .filter(item => item.id !== 'wishlistPlaceholder'); // Exclude wishlistPlaceholder
        
        return { success: true, wishlistItems };
    } catch (error) {
        console.error('Error fetching wishlist items:', error);
        return { success: false, message: 'Failed to fetch wishlist items' };
    }
}