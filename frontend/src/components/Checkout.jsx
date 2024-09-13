import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Checkout() {
    const { state } = useLocation();
    const { product, quantity } = state || {};
    const [user, setUser] = useState({ name: '', phone: '', address: '' });
    const [totalPrice, setTotalPrice] = useState(product ? product.price * quantity : 0);
    const [loading, setLoading] = useState(true);
    const [quant, setQuant] = useState(quantity);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        setTotalPrice(product.price * quant);
    }, [quant, product]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('/api/userDetails');
            if (response.data.success) {
                setUser(response.data.user);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    const handleCheckout = async () => {
        const orderDetails = {
            name: user.name,
            phone: user.phone,
            address: user.address,
            productTitle: product.title,
            productImg: product.image,
            quantity: quant,
            totalPrice,
        };

        try {
            const response = await axios.post('/api/checkout', orderDetails);
            if (response.data.success) {
                console.log();
                // Optionally redirect to a success page or show a success message
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
        setUser({ ...user, [name]: value });
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
                                    value={user.name}
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
                                    value={user.phone}
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
                                    value={user.address}
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
