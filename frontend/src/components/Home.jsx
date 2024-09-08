import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function Home() {
    const [items, setItems] = useState([]);

    useEffect(() => {
<<<<<<< HEAD
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setItems(data.data);
=======
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                setItems(data);
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-3">
                {items.map(item => (
                    <div key={item.id} className="col mb-4">
                        <div className="card h-100">
                            <img src={item.image} className="card-img-top img-fluid" alt={item.title} />
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
