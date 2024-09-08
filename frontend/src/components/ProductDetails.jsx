import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import heart from '../assets/heart_.png'
function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewText, setReviewText] = useState(""); // State for review text
    const [reviews, setReviews] = useState([]);
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        // Fetch product details and reviews
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
            } catch (error) {
                console.error('Error fetching product details or reviews:', error);
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
        axios.post('/api/product/addCart', { item_id: id, title:product.title, quantity, price: product.price, image:product.image })
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

    const handleReviewSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/reviews', { item_id: id, review: reviewText })
            .then(response => {
                if (response.data.success) {
                    alert('Review submitted successfully');
                    setReviewText(""); // Clear the review input field
                    setReviews(prevReviews => [...prevReviews, { review: reviewText }]); // Update reviews state
                } else {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };
    const handleAddToWishlist = () => {
        const apiEndpoint = isInWishlist ? '/api/product/removeWishlist' : '/api/product/addWishlist';
        axios.post(apiEndpoint, { item_id: id, title: product.title, price: product.price, image: product.image })
            .then(res => {
                if (res.data.success) {
                    setIsInWishlist(!isInWishlist); // Toggle state
                    alert(isInWishlist ? 'Product removed from wishlist' : 'Product added to wishlist');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error => {
                console.error('Error updating wishlist:', error);
            });
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
                        {isInWishlist?<button type="button" className="btn bg-transparent" onClick={handleAddToWishlist}>❤️</button>:<button type="button" className="btn bg-transparent" onClick={handleAddToWishlist}><img src={heart} alt="" style={{height:'100%'}}/></button>}
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
                            reviews.map((review, index) => (
                                <div key={index} className="review">
                                    <p>{index + 1}. {review.comment}</p>
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