import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Checkout() {
    const { state } = useLocation();
    const { user, product, quantity } = state || {};
    const [userData, setUser] = useState(user);
    const [totalPrice, setTotalPrice] = useState(product ? product.price * quantity : 0);
    // const [loading, setLoading] = useState(true);
    const [quant, setQuant] = useState(quantity);
    const navigate = useNavigate();

    useEffect(() => {
        setTotalPrice(product.price * quant);
    }, [quant, product]);    

    const handleCheckout = async () => {
        const orderDetails = {
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
            productTitle: product.title,
            productImg: product.image,
            quantity: quant,
            totalPrice,
        };
        try {
            const response = await axios.post('https://ecommerce-backend-sodu.onrender.com/api/checkout', orderDetails, { withCredentials: true });
            if (response.data.success) {
                alert("Order Placed")
                navigate('/')
            }
        } catch (error) {
            alert(error.response.data.message+". Try signing in again")
        }
    };

    if (!product || !quantity) {
        return <div className="text-center">No product or quantity information available.</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    return (
        <div className="container col-md-6 mt-4">
            <h2 className="mb-4">Checkout</h2>
            <div className="row">
                <div className="col-md-12">
                    <div className="card p-3 mb-4">
                        <h3 className="card-title">Customer Information</h3>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone Number:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-control"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address:</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    value={userData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address"
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="card p-3">
                        <h3 className="card-title">Product Information</h3>
                        <div className="mb-3">
                            <p><strong>Product:</strong> {product.title}</p>
                            <div className="col-md-6">
                                <img src={product.image} alt={product.title} className="img-fluid" />
                            </div>
                            <p><strong>Price per Unit:</strong> ${product.price}</p>
                            <label htmlFor="quantity" className="form-label">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                className="form-control"
                                value={quant}
                                onChange={(e) => setQuant(e.target.value)}
                            />
                        </div>
                        <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
                        <button onClick={handleCheckout} className="btn btn-primary mt-3">
                            Complete Purchase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
