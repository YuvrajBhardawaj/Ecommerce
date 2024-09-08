import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Nav() {
    const [categories, setCategories] = useState([]);
<<<<<<< HEAD
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetchCategories();
        checkLoginStatus();
=======
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user login status

    useEffect(() => {
        fetchCategories();
        checkLoginStatus(); // Check login status when component mounts
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
    }, [isLoggedIn]);

    const fetchCategories = async () => {
        try {
<<<<<<< HEAD
            const response = await axios.get('/api/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            }
=======
            const response = await axios.get('https://fakestoreapi.com/products/categories');
            setCategories(response.data);
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const checkLoginStatus = () => {
        axios.get('/api/check')
<<<<<<< HEAD
            .then((res) => setIsLoggedIn(res.data.success))
            .catch(err => console.log(err));
    };

    const signOut = () => {
        axios.delete('/api/signout')
            .then((res) => setIsLoggedIn(false))
            .catch(err => console.log(err));
    };

=======
        .then((res)=>setIsLoggedIn(res.data.success))
        .catch(err=>console.log(err))
    };
    const signOut=()=>{
        axios.delete('/api/signout')
        .then((res)=>setIsLoggedIn(false))
        .catch(err=>console.log(err))
    }
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
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
<<<<<<< HEAD
                            <li className="nav-item" key={category.id}>
                                <Link className="nav-link" to={`/category/${category.name}`}>{category.name}</Link>
=======
                            <li className="nav-item" key={category}>
                                <Link className="nav-link" to={`/category/${category}`}>{category}</Link>
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
                            </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <>
<<<<<<< HEAD
                                <li>
                                    <Link className="nav-link" to="/cart">Cart</Link>
                                </li>
=======
                                {/* If user is logged in, show sign out option */}
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
                                <li className="nav-item">
                                    <button className="nav-link" onClick={signOut}>Sign Out</button>
                                </li>
                            </>
<<<<<<< HEAD
                            
                        ) : (
                            <>
=======
                        ) : (
                            <>
                                {/* If user is not logged in, show sign in and sign up options */}
>>>>>>> 3a3454619793d3a1f743628594e16296ed201a0f
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
