import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import '../App.css';
import { Link } from 'react-router-dom';
function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/cart')
      .then(res => setItems(res.data.cartItems))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>
      {items.length > 0 ? (
        <div className="row">
          {items.map(item => (
            <Link to={`/product/${item.id}`} key={item.id} className="col-12 mb-3" style={{ textDecoration: 'none' }}>
              <div className="card p-3 cart-item">
                <div className="row g-0 h-100">
                  <div className="col-md-3 d-flex justify-content-center align-items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid rounded-start cart-item-image"
                    />
                  </div>
                  <div className="col-md-9 d-flex flex-column justify-content-center">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">Price: ${item.price}</p>
                      <p className="card-text">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
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