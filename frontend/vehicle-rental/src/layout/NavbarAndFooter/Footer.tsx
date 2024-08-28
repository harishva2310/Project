import { Link, NavLink } from "react-router-dom";

export const Footer = () => {
    return (
        /*<div className='main-color'>
            <footer className='container d-flex flex-wrap 
                justify-content-between align-items-center py-5 main-color'>
                <p className='col-md-4 mb-0 text-white'>© Example Vehicle Rental App, Inc</p>
                <ul className='nav navbar-dark col-md-4 justify-content-end'>
                    <li className='nav-item'>
                        <Link to='/home' className='nav-link px-2 text-white'>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/searchvehicles' className='nav-link px-2 text-white'>
                            Search Vehicles
                        </Link>
                    </li>
                </ul>
            </footer>
        </div>*/

        <section data-bs-version="5.1" className="footer3 cid-sFCygHrmNf" id="footer3-24">





            <div className="container">
                <div className="row align-center mbr-white">
                    <div className="row row-links">
                        <ul className="foot-menu">





                            <li className="foot-menu-item mbr-fonts-style display-7"><NavLink to="/home" className="text-white">Home</NavLink>
                            </li>
                            <li className="foot-menu-item mbr-fonts-style display-7"><NavLink to="/searchvehicles"
                                className="text-white">Search Vehicles</NavLink></li>
                            <li className="foot-menu-item mbr-fonts-style display-7"><NavLink to="/about"
                                className="text-white">About</NavLink></li>
                            <li className="foot-menu-item mbr-fonts-style display-7"><NavLink to=""
                                className="text-white text-primary">Pricing</NavLink></li>
                            <li className="foot-menu-item mbr-fonts-style display-7"><NavLink to=""
                                className="text-white">Teams</NavLink></li>
                            <li className="foot-menu-item mbr-fonts-style display-7"><NavLink to=""
                                className="text-white">Contacts</NavLink></li>
                        </ul>
                    </div>
                    <div className="row social-row">
                        <div className="social-list align-right pb-2">






                            <div className="soc-item">
                                <a href="https://twitter.com/mobirise" target="_blank">
                                    <span className="socicon-twitter socicon mbr-iconfont mbr-iconfont-social"></span>
                                </a>
                            </div>
                            <div className="soc-item">
                                <a href="https://www.facebook.com/pages/Mobirise/1616226671953247" target="_blank">
                                    <span className="socicon-facebook socicon mbr-iconfont mbr-iconfont-social"></span>
                                </a>
                            </div>
                            <div className="soc-item">
                                <a href="https://www.youtube.com/c/mobirise" target="_blank">
                                    <span className="socicon-youtube socicon mbr-iconfont mbr-iconfont-social"></span>
                                </a>
                            </div>
                            <div className="soc-item">
                                <a href="https://instagram.com/mobirise" target="_blank">
                                    <span className="socicon-instagram socicon mbr-iconfont mbr-iconfont-social"></span>
                                </a>
                            </div>
                            <div className="soc-item">
                                <a href="https://plus.google.com/u/0/+Mobirise" target="_blank">
                                    <span className="socicon-googleplus socicon mbr-iconfont mbr-iconfont-social"></span>
                                </a>
                            </div>
                            <div className="soc-item">
                                <a href="https://www.behance.net/Mobirise" target="_blank">
                                    <span className="socicon-behance socicon mbr-iconfont mbr-iconfont-social"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="row row-copirayt">
                        <p className="mbr-text mb-0 mbr-fonts-style mbr-white align-center display-7">
                            © Copyright 2024 Vehicle Rental. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}