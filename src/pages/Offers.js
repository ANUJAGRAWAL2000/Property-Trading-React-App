import React,{useEffect,useState} from 'react'
import Layout from '../components/Layouts/Layout'
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { useParams } from 'react-router-dom';
import { collection,getDocs,query,where,orderBy,limit,startAfter }from 'firebase/firestore';
import Spinner from '../components/Spinner';
import ItemsList from '../components/ItemsList';
import "../style/Offers.css"

const Offers = () => {

    const [listings,setListing] = useState(null);
    const [loading,setLoading] = useState(true);
    const [lastFetchListing,setLastFetchListing] = useState(null);
    const params = useParams();

    //Fetch Listing
    useEffect(() => {
        const fetchListing = async() => {
            try{
                //reference
                const listingsRef = collection(db,'listings');

                //query
                console.log(params.categoryName);
                const q=query(listingsRef,where('offer','==',true),orderBy('timestamp'),limit(1))

                //executeQuery
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchListing(lastVisible);
                const listings = []
                querySnap.forEach((doc) => {
                    return listings.push({
                        id : doc.id,
                        data : doc.data()
                    })
                });
                setListing(listings);
                setLoading(false);
            } catch(error){
                console.log(error);
                toast.error('unable to fetch data');
            }
        };

        ///func call
        fetchListing();
    },[]);

    const fetchLoadMoreListing = async() => {
        try{
            //reference
            const listingsRef = collection(db,'listings');

            //query
            const q=query(listingsRef,
                where('offer','==',true),
                orderBy('timestamp'),
                startAfter(lastFetchListing),
                limit(10))

            //executeQuery
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchListing(lastVisible);
            const listings = []
            querySnap.forEach((doc) => {
                console.log("Params : " + listings);
                listings.push({
                    id : doc.id,
                    data : doc.data()
                })
            });

            console.log("Params : " + listings);
            setListing(prevState => [...prevState, ...listings]);
            setLoading(false);
        } catch(error){
            console.log(error);
            toast.error('unable to fetch data');
        }
    };


    return (
        <Layout title="best offer on house">
            <div className="offers mt-3 container-fluid">
                <h1>
                    {"Best Offers"}
                </h1>

                { loading ? (
                    <Spinner/> 
                    ) : listings && listings.length > 0 ? (
                        <div> 
                            {listings.map(list => (
                                <ItemsList listing={list.data} id={list.id} key={list.id}/>
                            ))
                            }
                        </div>
                    ) : (
                        <p>No Listings With Offer </p>
                    )
                }
            </div>

            <div className="d-flex  align-items-center justify-content-center mb-4">
                {
                    lastFetchListing && (
                        <button className="load-btn"
                        onClick={fetchLoadMoreListing}>
                            Load More
                        </button>
                    )
                }
            </div>
        </Layout>
    )
}

export default Offers
