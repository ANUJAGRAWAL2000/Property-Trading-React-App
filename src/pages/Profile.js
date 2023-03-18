import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../components/Layouts/Layout';
import {getAuth, updateProfile} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {db} from '../firebase.config';
import {MdModeEditOutline,MdDoneOutline} from 'react-icons/md';
import {FaArrowAltCircleRight, FaEdit} from 'react-icons/fa';
import { doc,setDoc,updateDoc,collection,getDocs,query,orderBy,where,deleteDoc } from 'firebase/firestore';
import ItemsList from '../components/ItemsList';
import "../style/Profile.css";

const Profile = () => {
    
    const auth = getAuth();
    const [changeDetails,setChangeDetails] = useState(false);
    const [loading,setLoading] = useState(true);
    const [listings,setListings] = useState(null);

    useEffect(() => {
        const fetchUserListing = async() => {
            const listingRef = collection(db,'listings');
            const q = query(listingRef, where('useRef','==',auth.currentUser.uid),orderBy('timestamp'));
            const querySnap = await getDocs(q);
            let listings = []
            querySnap.forEach((doc) => {
                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            });
            setListings(listings);
            setLoading(false);
            console.log(listings);
        }
        fetchUserListing(); 
    },[]);
    
    const [formData,setFormData] = useState({
        name : auth.currentUser.displayName,
        email : auth.currentUser.email
    });

    const navigate = useNavigate();
    
    //Destructure
    const {name,email} = formData;

    const logoutHandler = () => {
        auth.signOut();
        toast.success("Logout Successfully!!");
        navigate('/');
    }

    //onChangee
    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id] : e.target.value,
        }))
    } 

    //onDelete
    const onDelete = async(id) => {
        if(window.confirm('Are you sure want to delete ?')){
            await deleteDoc(doc(db,'listings',id));
            const updatedListings = listings.filter(listing => listing.id !== id);
            setListings(updatedListings);
            toast.success('Listing Deleted Successfully');
        }
    }

    //onEditListing
    const onEdit = (listingId) => {
         navigate(`/editListing/${listingId}`);
    }

    //submit Handler
    const onSubmit = async() => {
        try{
            if(auth.currentUser.displayName !== name){
                await updateProfile(auth.currentUser,{
                    displayName : name
                })
                const userRef = doc(db,'users',auth.currentUser.uid);
                await updateDoc(userRef,{name});
                toast('User Details updated Successfully !!');
            }
        }
        catch(error){
            toast('Something went wrong !!');
            console.log(error);
        }
    }

    return (
        <Layout>
            <div className="row profile-container">
            <div className="col-md-6 profile-container-col1">
            <img src="./assets/ProfileImage.png" alt="profile" />
            </div>
            <div className="col-md-6 profile-container-col2">
            <div className="container mt-4  d-flex justify-content-between">
                <h2>Profile Details</h2>
                <button className="btn btn-danger" onClick={logoutHandler}>
                Logout
                </button>
            </div>
            <div className="   mt-4 card">
                <div className="card-header">
                <div className="d-flex justify-content-between ">
                    <p>Your Personal Details </p>
                    <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        changeDetails && onSubmit();
                        setChangeDetails((prevState) => !prevState);
                    }}
                    >
                    {changeDetails ? (
                        <MdDoneOutline color="green" />
                    ) : (
                        <FaEdit color="red" />
                    )}
                    </span>
                </div>
                </div>
                <div className="card-body">
                <form>
                    <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={onChange}
                        disabled={!changeDetails}
                    />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        value={email}
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        onChange={onChange}
                        disabled={!changeDetails}
                    />
                    </div>
                </form>
                </div>
            </div>
            <div className="mt-3 create-listing">
                <Link to="/createListing">
                <FaArrowAltCircleRight color="primary" /> &nbsp; Sell or Rent Your
                Home
                </Link>
            </div>
            </div>
        </div>

        <div className="container-fluid mt-4 your-listings">
            {listings && listings?.length > 0 && (
            <>
                <h3 className="mt-4">Your Listings</h3>
                <div>
                {listings.map((listing) => (
                    <ItemsList
                    className="profile-listing"
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                    />
                ))}
                </div>
            </>
            )}
        </div>
        </Layout>

        // <Layout>
        //     <div className="w-50 container mt-4 d-flex justify-content-between">
        //         <h1>Profile Details</h1>
        //         <button className = "btn btn-danger" onClick={logoutHandler}>Logout</button>
        //     </div>

        //     <div className="container mt-4 card" style={{width: '18rem'}}>
        //         <div className="card-header">
        //             <div className="d-flex justify-content-between">
        //                 <p>User Personal Details</p>
        //                 <span style={{cursor:"pointer"}} 
        //                 onClick={() => {
        //                     changeDetails && onSubmit();
        //                     setChangeDetails(prevState => !prevState)}}>
        //                     {!changeDetails ? <MdModeEditOutline color="red" /> : <MdDoneOutline color="green"/>}
        //                 </span>
        //             </div>
        //         </div>
        //         <div className="card-body">
        //             <form>
        //                 <div className="mb-3">
        //                     <label htmlFor="exampleInputName1" className="form-label">Name</label>
        //                     <input type="name" className="form-control" id="name" value={name} onChange={onChange} disabled={!changeDetails}/>
        //                 </div>
        //                 <div className="mb-3">
        //                     <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
        //                     <input type="email" className="form-control" id="email" value={email} aria-describedby="emailHelp" onChange={onChange} disabled={!changeDetails}/>
        //                 </div>
        //             </form>
        //         </div>
        //     </div>
        //     <div className="container mt-4  d-flex justify-content-center">
        //         <Link to="/createListing">
        //             <h5>Sell or Rent your home <FaArrowAltCircleRight/></h5>
        //         </Link>
        //     </div>
        //     <div className="container">
        //         {listings && listings?.length > 0 && (
        //             <>
        //             <h4>Your Listings</h4>
        //             <div>
        //                 {listings.map((listing) => (
        //                     <ItemsList 
        //                     key={listing.id} 
        //                     listing={listing.data} 
        //                     id={listing.id}
        //                     onDelete={() => onDelete(listing.id)}
        //                     onEdit={() => onEdit(listing.id)} />
        //                 ))}
        //             </div>
        //             </>
        //         )}
        //     </div>
        // </Layout>
    )
}

export default Profile
