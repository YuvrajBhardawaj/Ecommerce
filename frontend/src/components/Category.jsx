<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
=======
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f

function Category() {
    const [items, setItems] = useState([]);
    const { id } = useParams();
<<<<<<< HEAD

    useEffect(() => {
        axios.get(`/api/category/${id}`)
            .then(res => {
                setItems(res.data.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [id]);
=======
    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/category/${id}`)
            .then(res => res.json())
            .then(data => {
                setItems(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    },[id]);
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f

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

<<<<<<< HEAD
export default Category;
=======
export default Category
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
