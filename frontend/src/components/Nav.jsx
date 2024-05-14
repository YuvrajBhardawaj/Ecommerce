import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Nav() {
    const [categories, setCategories] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user login status

    useEffect(() => {
        fetchCategories();
        checkLoginStatus(); // Check login status when component mounts
    }, [isLoggedIn]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/products/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const checkLoginStatus = () => {
        axios.get('/api/check')
        .then((res)=>setIsLoggedIn(res.data.success))
        .catch(err=>console.log(err))
    };
    const signOut=()=>{
        axios.delete('/api/signout')
        .then((res)=>setIsLoggedIn(false))
        .catch(err=>console.log(err))
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">FakeStore</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        {categories.map(category => (
                            <li className="nav-item" key={category}>
                                <Link className="nav-link" to={`/category/${category}`}>{category}</Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <>
                                {/* If user is logged in, show sign out option */}
                                <li className="nav-item">
                                    <button className="nav-link" onClick={signOut}>Sign Out</button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* If user is not logged in, show sign in and sign up options */}
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
