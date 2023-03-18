import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {getAuth,sendPasswordResetEmail} from 'firebase/auth';
import Layout from '../components/Layouts/Layout';
import { toast } from 'react-toastify';


const ForgotPassword = () => {

    const [email,setEmail] = useState("");
    const navigate = useNavigate();

    const onChange = (e) => {
        setEmail(e.target.value)
    }

    const onSubmitHandler = async(e) => {
        e.preventDefault();
        try{
            const auth = getAuth();
            await sendPasswordResetEmail(auth,email);
            toast.success('Email sent successfully');
            navigate("/signin");

        } catch(error){
            toast.error('Something went wrong');
        }
    }

    return (
        <Layout>
            <div className="container">
                    <h1>Reset Your Password</h1>

                    <form onSubmit={onSubmitHandler} className="container">
                        <div className="container mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" value={email} onChange={onChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button type="submit" class="btn btn-primary">Reset</button>
                            <Link to="/signin">Sign In</Link>
                        </div>

                    </form>

            </div>
        </Layout>
    )
}

export default ForgotPassword
