import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); // Default quantity is 1

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
            })
            .catch(error => console.error('Error fetching product details:', error));
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    // Function to handle changing quantity
    const handleChangeQuantity = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
    };

    // Function to handle adding to cart
    const handleAddToCart = () => {
        // Here you can make your Axios request
        axios.post('/api/product/addCart', { item_id : id, quantity, price :product.price})
            .then(response => {
                // Handle success if needed
                console.log('Product added to cart:', response.data);
            })
            .catch(error => {
                // Handle error if needed
                console.error('Error adding product to cart:', error);
            });
    };

    // Function to handle buying now
    const handleBuyNow = () => {
        // Here you can make your Axios request
        axios.post('/api/product/BuyNow/:id', { productId: id, quantity })
            .then(response => {
                // Handle success if needed
                console.log('Product bought:', response.data);
            })
            .catch(error => {
                // Handle error if needed
                console.error('Error buying product:', error);
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
                    <div className="btn-group" role="group" aria-label="Add to Cart">
                        <button type="button" className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                        <button type="button" className="btn btn-success" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
