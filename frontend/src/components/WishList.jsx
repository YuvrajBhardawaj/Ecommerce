import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import '../App.css'; // Assuming custom styles are in this file
import { Link } from 'react-router-dom';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        // Fetch all wishlist items
        const fetchWishlistItems = async () => {
            try {
                const response = await axios.get('https://ecommerce-backend-sodu.onrender.com/api/wishlist', { withCredentials: true });
                if (response.data.success) {
                    setWishlistItems(response.data.wishlist); // Update state with fetched wishlist items
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            }
            setLoading(false); // Stop loading once the data is fetched
        };

        fetchWishlistItems();
    }, []);

    const handleRemoveFromWishlist = (itemId) => {
        // Remove item from wishlist
        axios.post('https://ecommerce-backend-sodu.onrender.com/api/product/removeWishlist', { item_id: itemId })
            .then(res => {
                if (res.data.success) {
                    setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId)); // Update state after removal
                    //alert('Product removed from wishlist');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error => {
                console.error('Error removing item from wishlist:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Your Wishlist</h2>
            {wishlistItems.length > 0 ? (
                <div className="row">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="col-12 mb-3">
                            <div className="card p-3 wishlist-item">
                                <div className="row g-0 h-100">
                                    <div className="col-md-3 d-flex justify-content-center align-items-center">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="img-fluid rounded-start wishlist-item-image"
                                        />
                                    </div>
                                    <div className="col-md-9 d-flex flex-column justify-content-between">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">Price: ${item.price}</p>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-danger me-2"
                                                onClick={() => handleRemoveFromWishlist(item.id)}
                                            >
                                                Remove from Wishlist
                                            </button>
                                            <Link to={`/product/${item.id}`} className="btn btn-primary">
                                                View Product
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                    <p className="text-muted h4">Wishlist is Empty</p>
                </div>
            )}
        </div>
    );
}

export default Wishlist;
