import React,{useEffect,useState} from 'react'
import Layout from '../components/Layouts/Layout'
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { useParams } from 'react-router-dom';
import { collection,getDocs,query,where,orderBy,limit,startAfter }from 'firebase/firestore';
import Spinner from '../components/Spinner';
import ItemsList from '../components/ItemsList';

const Category = () => {
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
                const q=query(listingsRef,where("type","==",params.categoryName),orderBy('timestamp'),limit(10))

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
                    where("type","==",params.categoryName),
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
        <Layout>
            <div className="mt-3 container-fluid">
                <h1>
                    {params.categoryName === "rent" ? "Places For Rent" : "Places For Sale"}
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
                        <p>No Listings For {params.categoryName} </p>
                    )
                }
            </div>

            <div className="d-flex  align-items-center justify-content-center mb-4">
                {
                    lastFetchListing && (
                        <button className="load-btn btn btn-primary"
                        onClick={fetchLoadMoreListing}>
                            Load More
                        </button>
                    )
                }
            </div>
        </Layout>
    )
}

export default Category
