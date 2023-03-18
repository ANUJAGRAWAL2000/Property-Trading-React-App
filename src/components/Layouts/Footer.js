import React from 'react';
import { Link } from "react-router-dom";
import "../../style/Footer.css";

const Footer = () => {
    return (
        <div className="footer pt-4 d-flex flex-column align-items-center justify-content-center bg-dark text-light p-4">
            <h3>
                Made With Love From India
                {/* <img
                src="./assets/love.gif"
                alt="love"
                height={60}
                width={80}
                className="mx-3 footer-gif"
                /> */}
            </h3>
            <h6>All Rights Reserved &copy; Mr_AA 2023</h6>
        </div>
    )
}

export default Footer
