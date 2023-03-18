import React,{useState,useEffect} from 'react';
import { db } from '../firebase.config';
import { collection, getDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SwipeCore,{EffectCoverflow,Navigation,Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import Spinner from './Spinner';

//Configure
SwipeCore.use([EffectCoverflow,Pagination]); 

const Slider = () => {

    const [listings,setListings] = useState(null);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();

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
                            <Swiper
                            modules={[Pagination]}
                            effect={"coverflow"}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={1}
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            className="mySwipe"
                            >
                                {listings.map(({data,id}) => (
                                    <SwiperSlide key={id}>
                                        <img src={data.ImrUrls[0]}
                                        alt={data.name}
                                        height={400}
                                        width={800} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
        </div>
    )
}

export default Slider
