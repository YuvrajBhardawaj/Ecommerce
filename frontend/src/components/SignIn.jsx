import React, { useEffect, useState } from 'react';
import axios from "axios"
function SignIn() {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    function signIn(e) {
        e.preventDefault();
        if(email.length>0 && password.length>0){
            axios.post('https://ecommerce-backend-sodu.onrender.com/api/login',{email,password},{ withCredentials: true })
            .then((res)=>{
                console.log(res.data.message)
                if(res.data.success){
                    console.log(res.data.message)
                    window.location.href = '/';
                }
                else{
                  alert(res.data.message)
                }
            })
            .catch((err)=>console.log(err))
        }
    }
  return (
  <>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="p-4 border" onSubmit={signIn}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-dark bg-dark">SignIn</button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default SignIn;
