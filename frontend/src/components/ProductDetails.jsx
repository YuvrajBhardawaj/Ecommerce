import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import heart from '../assets/heart_.png';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewText, setReviewText] = useState(""); // State for review text
    const [reviews, setReviews] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for wishlist actions
    const [wishlistLoading, setWishlistLoading] = useState(true); // Loading state for wishlist check

    useEffect(() => {
        // Fetch product details, reviews, and wishlist status
        const fetchProductAndReviews = async () => {
            try {
                const productResponse = await axios.get(`/api/product/${id}`);
                setProduct(productResponse.data.data);

                const reviewsResponse = await axios.get(`/api/reviews/${id}`);
                if (reviewsResponse.data.success) {
                    setReviews(reviewsResponse.data.reviews);
                }

                const wishlistResponse = await axios.get(`/api/wishlist/check/${id}`);
                if (wishlistResponse.data.success) {
                    setIsInWishlist(wishlistResponse.data.isInWishlist);
                }
                setWishlistLoading(false); // Stop loading after wishlist status is fetched
            } catch (error) {
                console.error('Error fetching product details or reviews:', error);
                setWishlistLoading(false);
            }
        };

        fetchProductAndReviews();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleChangeQuantity = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        axios.post('/api/product/addCart', { item_id: id, title: product.title, quantity, price: product.price, image: product.image })
            .then(res => {
                if (res.data.success) {
                    alert('Product added to cart');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            });
    };

    const handleBuyNow = () => {
        axios.post('/api/product/BuyNow', { productId: id, quantity })
            .then(response => {
                console.log('Product bought:', response.data);
            })
            .catch(error => {
                console.error('Error buying product:', error);
            });
    };

    const handleReviewChange = (event) => {
        setReviewText(event.target.value);
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post('/api/reviews', { item_id: id, review: reviewText });
            
            if (response.data.success) {
                //alert('Review submitted successfully');
                
                // Clear the review input field
                setReviewText("");
                
                // Fetch latest product and reviews data after submitting the review
                const reviewsResponse = await axios.get(`/api/reviews/${id}`);
                if (reviewsResponse.data.success) {
                    setReviews(reviewsResponse.data.reviews); // Manually update the reviews state
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleAddToWishlist = () => {
        setLoading(true); // Start loading during the wishlist action

        const apiEndpoint = isInWishlist ? '/api/product/removeWishlist' : '/api/product/addWishlist';
        
        axios.post(apiEndpoint, { item_id: id, title: product.title, price: product.price, image: product.image })
            .then(res => {
                setLoading(false); // Stop loading after the wishlist action completes
                if (res.data.success) {
                    setIsInWishlist(!isInWishlist); // Toggle wishlist status
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error => {
                setLoading(false);
                console.error('Error updating wishlist:', error);
            });
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            // Convert Firestore timestamp (seconds + nanoseconds) to JavaScript Date
            const date = new Date(timestamp.seconds * 1000); // Firestore timestamp is in seconds, JavaScript Date expects milliseconds
            return date.toLocaleString(); // Format the date and time for better readability
        }
        return "Invalid date";
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.image} alt={product.title} className="img-fluid product-image" />
                </div>
                <div className="col-md-6">
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            className="form-control"
                            min="1"
                            value={quantity}
                            onChange={handleChangeQuantity}
                        />
                    </div>
                    <div className="btn-group" role="group" aria-label="Product Actions" style={{height:'40px'}}>
                        <button type="button" className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                        <button type="button" className="btn btn-success" onClick={handleBuyNow}>Buy Now</button>
                        <button type="button" className="btn bg-transparent" onClick={handleAddToWishlist} disabled={loading || wishlistLoading}>
                            {wishlistLoading || loading
                                ? 'Loading...' // Show loading while waiting for wishlist actions or status
                                : (isInWishlist ? '❤️' : <img src={heart} alt="Add to Wishlist" style={{ height: '100%' }} />)
                            }
                        </button>
                    </div>
                    <div className="review-form mt-4">
                        <h4>Submit a Review</h4>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="form-group">
                                <label htmlFor="review">Review:</label>
                                <textarea
                                    id="review"
                                    name="review"
                                    className="form-control"
                                    rows="3"
                                    value={reviewText}
                                    onChange={handleReviewChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    </div>
                    <div className="previous-reviews mt-4">
                        <h4>Previous Reviews</h4>
                        {reviews.length > 0 ? (
                            reviews.map((data, index) => (
                                <div key={index} className="review border border-secondary p-2 mb-3">
                                    <p>{index + 1}. {data.comment.review}</p>
                                    <p><small>Submitted on: {formatDate(data.comment.createdAt)}</small></p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
