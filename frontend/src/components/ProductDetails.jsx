import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD
import heart from '../assets/heart_.png'
=======

>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewText, setReviewText] = useState(""); // State for review text
    const [reviews, setReviews] = useState([]);
<<<<<<< HEAD
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
=======
    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                axios.get(`/api/reviews/${id}`)
                .then(response => {
                    console.log(response.data)
                    if(response.data.success)
                        //console.log(response.data)
                        setReviews(response.data.reviews);
                })
                .catch(error => console.error('Error fetching product reviews:', error));
            })
            .catch(error => console.error('Error fetching product details:', error));
    }, [id,reviews]);
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleChangeQuantity = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
<<<<<<< HEAD
        axios.post('/api/product/addCart', { item_id: id, title:product.title, quantity, price: product.price, image:product.image })
=======
        axios.post('/api/product/addCart', { item_id: id, quantity, price: product.price })
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
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
<<<<<<< HEAD
        axios.post('/api/reviews', { item_id: id, review: reviewText })
            .then(response => {
                if (response.data.success) {
                    alert('Review submitted successfully');
                    setReviewText(""); // Clear the review input field
                    setReviews(prevReviews => [...prevReviews, { review: reviewText }]); // Update reviews state
                } else {
                    alert(response.data.message);
=======
        axios.post('/api/reviews', { item_id: id, review: reviewText }) 
            .then(response => {
                console.log(response)
                if(response.data.success){
                    alert('Review submitted successfully');
                    setReviewText(""); 
                }
                else{
                    alert(response.data.message)
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
                }
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };
<<<<<<< HEAD
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
=======

>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
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
<<<<<<< HEAD
                    <div className="btn-group" role="group" aria-label="Product Actions" style={{height:'40px'}}>
                        <button type="button" className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                        <button type="button" className="btn btn-success" onClick={handleBuyNow}>Buy Now</button>
                        {isInWishlist?<button type="button" className="btn bg-transparent" onClick={handleAddToWishlist}>❤️</button>:<button type="button" className="btn bg-transparent" onClick={handleAddToWishlist}><img src={heart} alt="" style={{height:'100%'}}/></button>}
=======
                    <div className="btn-group" role="group" aria-label="Add to Cart">
                        <button type="button" className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                        <button type="button" className="btn btn-success" onClick={handleBuyNow}>Buy Now</button>
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
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
<<<<<<< HEAD
                                    <p>{index + 1}. {review.comment}</p>
=======
                                    <p>{index+1}. {review.review}</p>
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
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
<<<<<<< HEAD

export default ProductDetails;
=======
export default ProductDetails;
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
