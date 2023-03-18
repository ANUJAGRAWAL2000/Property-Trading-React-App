import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Offers from './pages/Offers';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={ <HomePage/> }/>
        <Route path="/offers" element={ <Offers/> }/>
        <Route path="/signin" element={ <Signin/> }/>
        <Route path="/signup" element={ <Signup/> }/>
        <Route path="/profile" element={ <PrivateRoute /> }>
            <Route path="/profile" element={ <Profile /> } />
        </Route>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/category/:categoryName" element={<Category/>} />
        <Route path="/createListing" element={<CreateListing/>} />
        <Route path="/category/:categoryName/:listingId" element={<Listing/>} />
        <Route path="/contact/:landlordId" element={<Contact/>} />
        <Route path="/editListing/:listingId" element={<EditListing/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;