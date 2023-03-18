import React from 'react'
import Layout from '../components/Layouts/Layout'
import { useNavigate } from 'react-router-dom';
import Slider from '../components/Slider';
import ImageSlider from '../components/ImageSlider';
import "../style/HomePage.css";
import "../index.css";

const HomePage = () => {
    const img1 = "https://1.bp.blogspot.com/-BM4A4mx7Fp0/VQQ5YLZWPiI/AAAAAAAAtPs/ZbEjklLTo70/s1600/house-rented-purpose.jpg";
    const img2 = "https://www.investopedia.com/thmb/kZp7lYi4-3kV3w9EqVHoFjX3f3U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/buying-your-first-investment-property-top-10-tips.asp-ADD-Color-074cf6b2f8434f4fbc8d94edeb361cd6.jpg";
    const navigate = useNavigate();
    return (
        <Layout>
            <ImageSlider/>
            <div className="home-cat row d-flex align-items-center justify-content-center">
                    <h1>Category</h1>
                    <div className="col-md-5">
                        <div class="Imagecontainer">
                            <img src={img2} alt="Rent" style={{width:"100%"}}/>
                            <button className="btn" onClick={() => {navigate('/category/rent')}}>TO RENT</button>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div class="Imagecontainer">
                            <img src={img1} alt="Sale" style={{width:"100%"}}/>
                            <button className="btn" onClick={() => {navigate('/category/sell')}}>TO SALE</button>
                        </div>
                    </div>
            </div>
        </Layout>
    )
}

export default HomePage
