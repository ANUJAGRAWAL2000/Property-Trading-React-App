import React,{useState,useEffect} from 'react';
import { getDoc, doc, collection } from 'firebase/firestore';
import Layout from '../components/Layouts/Layout';
import {db} from '../firebase.config';
import {getAuth} from 'firebase/auth';
import {useNavigate,Link,useParams} from 'react-router-dom';
import Spinner from '../components/Spinner';
import Slider from "react-slick";
import "../style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../style/Listing.css";
import { FaBars, FaBed, FaBath, FaParking, FaHouseDamage, FaArrowCircleRight } from 'react-icons/fa';

const Listing = () => {

    const [listing,setListing] = useState("");
    const [loading,setLoading] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();
    
    const settings = {
        infinite: true,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
      autoplaySpeed: 2000,
    };

    useEffect(() => {
        const fetchListing = async() => {
            try{
                console.log("ID : " + params.listingId);
                const docRef = doc(db, "listings", params.listingId);
                const docSnap = await getDoc(docRef);
                console.log("Data : " + docSnap.data());
                console.log("Data : " + docSnap.data().ImrUrls);
                if(docSnap.exists()){
                    console.log("Data : " + docSnap.data());
                    setListing(docSnap.data());
                    setLoading(false);
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        fetchListing();
    },[]);

    if(loading){
        return <Spinner/>
    }

    return (
        <Layout title={listing.name}>
                <div className="row listing-container">
                    <div className="col-md-8 listing-container-col1">
                        {listing.ImrUrls === undefined ? (<Spinner/>) : (
                            <Slider {...settings}>
                                {listing.ImrUrls.map((url,index) => (
                                <div key={index}>
                                    <img src={listing.ImrUrls[index]} 
                                        alt={listing.name}
                                        height={400}
                                        width={800} />
                                </div>
                                ))}
                            </Slider>
                        )}
                    </div>

                    <div className="col-md-4 listing-container-col2">
                        <h3 className="text-center"> {listing.hasOwnProperty('name') ? listing.name : " "} </h3>
                        <h6>
                            Price : Rs/ {" "}
                            {listing.offer ? listing.discountPrice : listing.regularPrice} 
                        </h6>
                        <p>Property for : {listing.type === 'rent' ? "Rent" : "Sell"} </p>
                        <p>
                            {listing.offer && (
                                <span>
                                    Discount : {listing.regularPrice - listing.discountPrice} 
                                </span>
                            )}
                        </p>
                        <p>
                            <FaBed size={20} /> &nbsp;
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}
                        </p>
                        <p>
                            <FaBath size={20} /> &nbsp;
                            {listing.bathrooms > 1 ? `${listing.bathrooms} Bedrooms` : "1 Bathroom"}
                        </p>
                        <p>
                            <FaParking size={20} /> &nbsp;
                            {listing.parking ? `Parking spot` : "No Spot for Parking"}
                        </p>
                        <p>
                            <FaHouseDamage size={20} /> &nbsp;
                            {listing.furnished ? `Furnished house` : "Not Furnished"}
                        </p>
                        <Link 
                        classname="btn btn-success" 
                        to={`/contact/${listing.useRef}?listingName=${listing.name}`}>
                            Contact Landlord <FaArrowCircleRight size={20} />
                        </Link>

                    </div>
                </div>
        </Layout>
    )
}

export default Listing
