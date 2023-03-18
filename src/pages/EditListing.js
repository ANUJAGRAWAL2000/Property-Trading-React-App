import React,{useState,useEffect,useRef} from 'react';
import Layout from '../components/Layouts/Layout';
import {useNavigate, useParams} from 'react-router-dom';
import {getAuth,onAuthStateChanged} from 'firebase/auth';
import {AiOutlineFileAdd} from 'react-icons/ai';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes} from 'firebase/storage';
import {db} from '../firebase.config';
import { v4 as uuidv4} from 'uuid';
import {addDoc, collection, serverTimestamp, doc, updateDoc, getDoc} from 'firebase/firestore';

const EditListing = () => {
const [loading,setLoading] = useState(false);
const [listing,setListing] = useState(null);
const params = useParams();
const [geoLocationEnable,setGeoLocationEnable] = useState(false);
const [formData,setFormData] = useState({
    type : 'rent',
    name : '',
    bedrooms : 1,
    bathrooms : 2,
    parking : true,
    furnished : true,
    address : '',
    offer : true,
    regularPrice : 1000,
    discountPrice : 800,
    image : {},
    latitude : 0,
    longitude : 0
})

//Destructure
const {type,name,bedrooms,bathrooms,parking,furnished,address,offer,regularPrice,discountPrice,image,latitude,longitude} = formData;

const auth = getAuth()
const navigate = useNavigate();

//for Memory Leak Warning Prevention 
const isMounted = useRef(true);

useEffect(() => {
    if(isMounted){
        onAuthStateChanged(auth,(user) => {
            setFormData({
                ...formData,
                useRef : user.uid
            });
        })
    }
    else{
        navigate("/signin");
    }
    //eslint-disable-next-line
},[]);


//Check if user is loggedIn or not..
useEffect(() => {
    if(listing && listing.useRef !== auth.currentUser.uid){
        toast.error('You cann\'t edit this listing');
        navigate('/');
    }
    //eslint-disable-next-line
})

useEffect(() => {
    setLoading(true);
    const fetchListing = async() => {
        const docRef = doc(db,'listings',params.listingId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setListing(docSnap.data());
            setFormData({...docSnap.data()});
            setLoading(false);
        } else {
            navigate('/');
            toast.error('Listing not Exist!!');
        }
    }

    //execute Func
    fetchListing();
},[]);

if(loading){
    return <Spinner/>
}

//Form Submit
const onSubmit = async(e) => {
    e.preventDefault();
    // console.log(formData);
    console.log(discountPrice + " " + regularPrice);

    if((offer) && (discountPrice >= regularPrice)){
        setLoading(false);
        toast.error('Discount Price should be less than Regular Price');
        return;
    }

    if(image > 6){
        setLoading(false);
        toast.error('Maximum 6 Images can be selected only');
        return; 
    }

    let geoLocation = {};
    let location;
    if(geoLocationEnable){
        // In case if you want to get the co-ordinates from the address using the API and applying the credit card.

    }
    else{
        geoLocation.lat = latitude;
        geoLocation.lng = longitude;
        location = address;
    }

    //store images to firebase storage
    const storeImage = async(image) => {
        return new Promise((resolve,reject) => {
            const storage = getStorage();
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storaegRef = ref(storage, 'images/'+fileName)
            const uploadTask = uploadBytesResumable(storaegRef,image)
            uploadTask.on('state_changed',(snapshot) => {
                const progress = (snapshot.bytesTransferred/snapshot.totalBytes * 100)
                console.log('upload is' + progress + '% done');
                switch(snapshot.state){
                    case 'paused' :
                        console.log('Upload is paused!!')
                        break
                    case 'running' :
                        console.log('Upload is running')
                }
            },
            (error) => {
                reject(error)
            },
            //success
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            });
        });
    };

    const ImrUrls = await Promise.all([...image].map((image) => storeImage(image))
    ).catch(() => {
        setLoading(false)
        toast.error('Images not uploaded !!')
        return
    })
    console.log(ImrUrls);

    // save form data
    const formDataCopy = {...formData, ImrUrls, timestamp : serverTimestamp(), geoLocation}
    formData.location = address
    delete formDataCopy.image
    // delete formDataCopy.address
    !formDataCopy.offer && delete formDataCopy.discountPrice
    console.log(formDataCopy);
    const docRef = doc(db,'listings',params.listingId);
    await updateDoc(docRef,formDataCopy );
    // const docRef = await addDoc(collection(db,"listings"),formDataCopy);
    setLoading(false);
    toast.success('Listing Updated!!');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)

}

//On Change of Values
const onChangeHandler = (e) => {
    let boolean = null;
    if(e.target.value === "true"){
        boolean = true;
    }
    if(e.target.value === "false"){
        boolean = false;
    }
    
    //files
    if(e.target.files){
        setFormData((prevState) => ({
            ...prevState,
            image : e.target.files 
        }));
    }

    if(!e.target.files){
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id] : boolean ?? e.target.value,
        }));
    }        
}

return (
    <Layout>
        <div className="container d-flex flex-column align-items-center justify-content-center mb-4">
            <h3 className="mt-3 w-50 bg-dark text-light p-2 text-center">
                Update Listing &nbsp;
                <AiOutlineFileAdd />
            </h3>
        
        {/* sell rent button */}
        <form className="w-50 bg-light p-4" onSubmit={onSubmit}>
        <div className="d-flex flex-row mt-4">
            <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                value="rent"
                onChange={onChangeHandler}
                defaultChecked
                name="type"
                id="type"
            />
            <label className="form-check-label" htmlFor="rent">
                Rent
            </label>
            </div>
            <div className="form-check ms-3">
            <input
                className="form-check-input"
                type="radio"
                name="type"
                value="sell"
                onChange={onChangeHandler}
                id="type"
            />
            <label className="form-check-label" htmlFor="sell">
                Sell
            </label>
            </div>
        </div>
        {/* name */}
        <div className="mb-3 mt-4">
            <label htmlFor="name" className="form-label">
            Name
            </label>
            <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={onChangeHandler}
            required
            />
        </div>
        {/* bedrooms */}
        <div className="mb-3 mt-4">
            <label htmlFor="bedrooms" className="form-label">
            Bedrooms
            </label>
            <input
            type="number"
            className="form-control"
            id="bedrooms"
            value={bedrooms}
            onChange={onChangeHandler}
            required
            />
        </div>
        {/* bathrroms */}
        <div className="mb-3 mt-4">
            <label htmlFor="bathrooms" className="form-label">
            Bathrooms
            </label>
            <input
            type="number"
            className="form-control"
            id="bathrooms"
            value={bathrooms}
            onChange={onChangeHandler}
            required
            />
        </div>
        {/* parking */}
        <div className="mb-3 ">
            <label htmlFor="parking" className="form-label">
            Parking :
            </label>
            <div className="d-flex flex-row ">
            <div className="form-check">
                <input
                className="form-check-input"
                type="radio"
                value={true}
                onChange={onChangeHandler}
                name="parking"
                id="parking"
                />
                <label className="form-check-label" htmlFor="yes">
                Yes
                </label>
            </div>
            <div className="form-check ms-3">
                <input
                className="form-check-input"
                type="radio"
                name="parking"
                value={false}
                defaultChecked
                onChange={onChangeHandler}
                id="parking"
                />
                <label className="form-check-label" htmlFor="no">
                No
                </label>
            </div>
            </div>
        </div>
        {/* furnished */}
        <div className="mb-3 ">
            <label htmlFor="furnished" className="form-label">
            Furnished :
            </label>
            <div className="d-flex flex-row ">
            <div className="form-check">
                <input
                className="form-check-input"
                type="radio"
                value={true}
                onChange={onChangeHandler}
                name="furnished"
                id="furnished"
                />
                <label className="form-check-label" htmlFor="yes">
                Yes
                </label>
            </div>
            <div className="form-check ms-3">
                <input
                className="form-check-input"
                type="radio"
                name="furnished"
                value={false}
                defaultChecked
                onChange={onChangeHandler}
                id="furnished"
                />
                <label className="form-check-label" htmlFor="no">
                No
                </label>
            </div>
            </div>
        </div>
        {/* address */}
        <div className="mb-3">
            <label htmlFor="address">Address :</label>
            <textarea
            className="form-control"
            placeholder="Enter Your Address"
            id="address"
            value={address}
            onChange={onChangeHandler}
            required
            />
        </div>
        {/* geoLoaction */}
        {!geoLocationEnable && (
            <div className="mb-3 ">
            <div className="d-flex flex-row ">
                <div className="form-check">
                <label className="form-check-label" htmlFor="yes">
                    Latitude
                </label>
                <input
                    className="form-control"
                    type="number"
                    value={latitude}
                    onChange={onChangeHandler}
                    name="latitude"
                    id="latitude"
                />
                </div>
                <div className="form-check ms-3">
                <label className="form-check-label" htmlFor="no">
                    Longitude
                </label>
                <input
                    className="form-control"
                    type="number"
                    name="longitude"
                    value={longitude}
                    onChange={onChangeHandler}
                    id="longitude"
                />
                </div>
            </div>
            </div>
        )}
        {/* offers  */}
        <div className="mb-3 ">
            <label htmlFor="offer" className="form-label">
            Offer :
            </label>
            <div className="d-flex flex-row ">
            <div className="form-check">
                <input
                className="form-check-input"
                type="radio"
                value={true}
                onChange={onChangeHandler}
                defaultChecked
                name="offer"
                id="offer"
                />
                <label className="form-check-label" htmlFor="yes">
                Yes
                </label>
            </div>
            <div className="form-check ms-3">
                <input
                className="form-check-input"
                type="radio"
                name="offer"
                value={false}
                onChange={onChangeHandler}
                id="offer"
                />
                <label className="form-check-label" htmlFor="no">
                No
                </label>
            </div>
            </div>
        </div>
        {/* regular price */}
        <div className="mb-3 mt-4">
            <label htmlFor="name" className="form-label">
            Regular Price :
            </label>
            <div className=" d-flex flex-row ">
            <input
                type="number"
                className="form-control w-50 "
                id="regularPrice"
                name="regularPrice"
                value={regularPrice}
                onChange={onChangeHandler}
                required
            />
            {type === "rent" && <p className="ms-4 mt-2">$ / Month</p>}
            </div>
        </div>
        {/* offer */}
        {offer && (
            <div className="mb-3 mt-4">
            <label htmlFor="discountedPrice" className="form-label">
                Discounted Price :
            </label>

            <input
                type="number"
                className="form-control w-50 "
                id="discountPrice"
                name="discountPrice"
                value={discountPrice}
                onChange={onChangeHandler}
                required
            />
            </div>
        )}

        {/* files images etc */}
        <div className="mb-3">
            <label htmlFor="formFile" className="form-label">
            select images :
            </label>
            <input
            className="form-control"
            type="file"
            id="image"
            name="image"
            onChange={onChangeHandler}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
            />
        </div>
        {/* submit button */}
        <div className="mb-3">
            <input
            className="btn btn-primary w-100"
            type="submit"
            value="Update Listing"
            />
        </div>
        </form>
    </div>
    </Layout>
)
}

export default EditListing
