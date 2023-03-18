import React, {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import {BsFillEyeFill} from 'react-icons/bs';
import { toast } from 'react-toastify';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {db} from '../firebase.config';
import { doc, addDoc, serverTimestamp, collection, setDoc } from 'firebase/firestore';
import { OAuth } from '../components/OAuth';
import "../style/SignUp.css";

const Signup = () => {
    const [showPassword,setShowPassword] = useState(false);

    const [formData,setFormData] = useState({
        email : "",
        name : "",
        password : "",
    });

    const {name, email, password} = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id] : e.target.value,
        }));
    };

    const onSubmitHandler = async(e) => {
        e.preventDefault();
        try{
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            updateProfile(auth.currentUser , {displayName : name});
            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()
            await setDoc(doc(db,'users',user.uid),formDataCopy); 
            toast.success("SignUp Successful !!");
            navigate('/');
            alert('SignUp Successful');
        } catch (error) {
            toast.error("User not created !!"+error);
            console.log(error)
        }
    }

    const navigate = useNavigate();
    return (
        <Layout title="signup - house marketplace">
            <div className="row signup-container">
                <div className="col-md-6 signup-container-col-1">
                <img src="./assets/SignUpPage.png" alt="welcome" />
                </div>
                <div className="col-md-6 signup-container-col-2">
                <form onSubmit={onSubmitHandler}>
                    <h3 className=" mt-2 text-center ">Sign Up </h3>
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        className="form-control"
                        id="name"
                        onChange={onChange}
                        aria-describedby="nameHelp"
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={onChange}
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={onChange}
                        className="form-control"
                        id="password"
                    />
                    </div>
                    <div className="mb-3">
                    show password
                    <BsFillEyeFill
                        className="text-danger ms-2  "
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                        setShowPassword((prevState) => !prevState);
                        }}
                    />
                    </div>
                    <button type="submit" className="btn signup-button">
                    Sign up
                    </button>
                    <span className="ms-4">Already User</span>{" "}
                    <Link to="/signin">Login</Link>
                    <div className="mt-3">
                    <OAuth />
                    </div>
                </form>
                </div>
            </div>
        </Layout>
        // <Layout>
        //     <div className="d-flex align-items-center justify-content-center w-100 mt-4">
        //         <form className="bg-light p-4 mt-4 w-25" onSubmit={onSubmitHandler}>
        //             <h4 className="bg-dark p-2 mt-2 text-light text-center">Sign Up</h4>
        //             <div className="mb-3">
        //                 <label htmlFor="exampleInputEmail1" className="form-label">Enter Name</label>
        //                 <input type="text" value={name} onChange={onChange} className="form-control" id="name" aria-describedby="nameHelp" />
        //             </div>
        //             <div className="mb-3">
        //                 <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
        //                 <input type="email" value={email} onChange={onChange}  className="form-control" id="email" aria-describedby="emailHelp" />
        //             </div>
        //             <div className="mb-3">
        //                 <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
        //                 <input type={showPassword ? "text" : "password"} value={password} onChange={onChange}  className="form-control" id="password" />
        //                 <span>
        //                     show password 
        //                     <BsFillEyeFill 
        //                     style = { {cursor : "pointer"} }
        //                     className="ms-2 text-danger"
        //                     onClick={() => {
        //                         setShowPassword((prevState) => !prevState);
        //                     }}/>
        //                 </span>
        //             </div>
        //             <button 
        //             style={{width:'100%', justifyContent: 'center', alignItems: 'center'}} 
        //             type="submit" className="btn btn-primary">SignUp</button>

        //             <div style={{marginTop:10}}>
        //                 <OAuth/>
        //                 <span>Already User</span> <Link to="/signin">SignIn</Link>
        //             </div>
        //         </form>
        //     </div>
        // </Layout>
    )
}

export default Signup