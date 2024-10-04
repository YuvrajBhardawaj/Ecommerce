import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import '../App.css';
import { Link } from 'react-router-dom';

function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch cart items on component load
    axios.get('/api/cart')
      .then(res => setItems(res.data.cartItems))
      .catch(err => console.log(err));
  }, []);

  // Handle removing an item from the cart
  const handleRemoveItem = (itemId) => {
    axios.delete(`/api/cart/${itemId}`)
      .then(res => {
        if (res.data.success) {
          // Remove the item from the items state
          setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } else {
          alert('Failed to remove item from cart');
        }
      })
      .catch(err => {
        console.error('Error removing item from cart:', err);
        alert('Failed to remove item from cart');
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>
      {items.length > 0 ? (
        <div className="row">
          {items.map(item => (
            <div key={item.id} className="col-12 mb-3">
              <div className="card p-3 cart-item">
                <div className="row g-0 h-100">
                  <div className="col-md-3 d-flex justify-content-center align-items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid rounded-start cart-item-image"
                    />
                  </div>
                  <div className="col-md-9 d-flex flex-column justify-content-between">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">Price: ${item.price}</p>
                      <p className="card-text">Quantity: {item.quantity}</p>
                      <p>Total Cost : {item.price*item.quantity}</p>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
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
          <p className="text-muted h4">Cart is Empty</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
