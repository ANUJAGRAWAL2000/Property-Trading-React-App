import React,{useState,useEffect} from 'react';
import { db } from '../firebase.config';
import { ImLocation2 } from "react-icons/im";
import Slider from "react-slick";
import "../style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { collection, getDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import "../style/ImageSlider.css";

const ImageSlider = () => {
    const [listings,setListings] = useState(null);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();

    const userPic = "https://openclipart.org/download/247319/abstract-user-flat-3.svg";

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
        const fetchListings = async() => {
            const listingRef = collection(db,"listings");
            const q = query(listingRef, orderBy('timestamp'), limit(5));
            const querySnap = await getDocs(q);
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id : doc.id,
                    data : doc.data()
                })
            })
            setListings(listings);
            setLoading(false);
        }
        fetchListings();
        console.log(listings === null ? "loading" : listings); 
        //eslint-disable-next-line 
    },[]);

    if(loading){
        <Spinner/>
    }

    return (
        <div style={{width : "100%"}}>
            {listings === null ? (<Spinner/>) : (
                        <Slider {...settings} >
                            {listings.map(({data,id}) => (
                                <div
                                className="mySwipe"
                                key={id}
                                onClick = {() => {
                                    navigate(`/category/${data.type}/${id}`);
                                }}>
                                    <img 
                                    src={data.ImrUrls[0]}
                                    alt={data.name}
                                    className="slider-img"/>

                                    <h4 className=" text-light p-4 m-0 ">
                                        <ImLocation2 size={20} className="ms-2" /> Recently Added :{" "}
                                        <br />
                                        <span className="ms-4 mt-2"> {data.name}</span>
                                        <span className="ms-2">
                                            | Price ( $ {data.regularPrice} )
                                        </span>
                                    </h4>

                                    {/* <h6 className="bg-info text-light p-2 m-0">
                                        <img
                                        src={userPic}
                                        alt="userPic"
                                        height={35}
                                        width={35}/>
                                        <span className="ms-2">{data.name}</span>
                                    </h6> */}
                                </div>
                            ))}
                          </Slider>
                        )}
        </div>
    )
}

export default ImageSlider
