import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Ensure this includes the same styles used in Cart and Wishlist

function Home() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setItems(data.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-3">
                {items.map(item => (
                    <div key={item.id} className="col mb-4">
                        <div className="card h-100">
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                                <img src={item.image} className="product-image card-img-top" alt={item.title} />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                            </div>
                            <div className="card-footer">
                                <p className="card-text text-muted">Price: ${item.price}</p>
                                <Link to={`/product/${item.id}`} className="btn btn-primary">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
