import React, { useState } from 'react';
import axios from "axios";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");

    function signUp(e) {
        e.preventDefault();
        if (name.length > 0 && email.length > 0 && phone.length > 0 && address.length > 0 && password.length > 0 && gender.length > 0) {
            axios.post('/api/signup', { name, email, phone, address, password, gender })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.success) {
                        console.log(res.data.message);
                        window.location.href = '/signin';
                    }
                })
                .catch((err) =>{
                    if(err.response.data.message==="auth/email-already-in-use")
                        alert("The email is already in use by another account.")
                    else
                        console.log(err)
                });
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form className="p-4 border" onSubmit={signUp}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="exampleInputName" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPhone" className="form-label">Phone</label>
                                <input type="text" className="form-control" id="exampleInputPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputAddress" className="form-label">Address</label>
                                <input type="text" className="form-control" id="exampleInputAddress" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputGender" className="form-label">Gender</label>
                                <select className="form-control" id="exampleInputGender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-dark bg-dark">SignUp</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;
