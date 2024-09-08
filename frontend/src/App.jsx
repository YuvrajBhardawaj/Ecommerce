import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './components/Nav';
import Category from './components/Category';
import SignIn from './components/SignIn'
import SignUp from './components/SignUp';
import Cart from './components/Cart';

function App() {
    return (
      <div>
        <Nav/>      
      <Routes>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path='/category/:id' element={<Category/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/cart' element={<Cart/>}></Route>
      </Routes>
      </div>
    );
}

export default App;
