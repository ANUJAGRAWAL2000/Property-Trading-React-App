import React from 'react';
import {Link} from 'react-router-dom';
import {FaBed} from 'react-icons/fa';
import {MdKitchen} from 'react-icons/md';
import "../style/ListingItems.css";

const ItemsList = ({listing,id,onDelete,onEdit}) => {
    return (
        <div className="card-item-parent d-flex align-items-center justify-content-center ">
            <div className="item-card category-link mb-2" style={{width : "800px"}}>
                <div>
                    <div className="row container p-2">
                            <div className="col-md-5 align-items-center item-card-continer1">
                                <Link to={`/category/${listing.type}/${id}`}>
                                    <img 
                                    alt={listing.name} 
                                    className="img-thumbnail"
                                    src={listing.ImrUrls[0]}
                                    height={300} 
                                    width={300}/> 
                                </Link>
                            </div>
                            <div className="col-md-5 item-card-continer2">
                                <p>{listing.location}</p>
                                <h2>{listing.name} </h2>
                                
                                <p>Rs : {" "}
                                {listing.offer ? listing.discountPrice : listing.regularPrice}
                                {" "} 
                                {listing.type === 'rent' ? " / Month " : " "}
                                </p>

                                <p>
                                    <FaBed/> {" "}
                                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}
                                </p>

                                <p>
                                    <MdKitchen/> {" "}
                                    {listing.kitchen > 1 ? `${listing.kitchen} Kitchen` : "1 Kitchen"}
                                </p>

                                <div>
                                {onDelete && 
                                    <button className="btn btn-danger m-2" onClick={() => {onDelete(id,listing.name)}}>Delete Listing</button>
                                }

                                {onEdit && 
                                    <button className="btn btn-info m-2" onClick={() => {onEdit(id)}}>Edit Listing</button>
                                }
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemsList
