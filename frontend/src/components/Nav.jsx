import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Nav() {
    const [categories, setCategories] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetchCategories();
        checkLoginStatus();
    }, [isLoggedIn]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const checkLoginStatus = () => {
        axios.get('/api/check')
            .then((res) => setIsLoggedIn(res.data.success))
            .catch(err => console.log(err));
    };

    const signOut = () => {
        axios.delete('/api/signout')
            .then((res) => setIsLoggedIn(false))
            .catch(err => console.log(err));
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">MyStore</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        {categories.map(category => (
                            <li className="nav-item" key={category.id}>
                                <Link className="nav-link" to={`/category/${category.name}`}>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link className="nav-link" to="/cart">Cart</Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/wishlist">WishList</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" onClick={signOut}>Sign Out</button>
                                </li>
                            </>
                            
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signin">Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
