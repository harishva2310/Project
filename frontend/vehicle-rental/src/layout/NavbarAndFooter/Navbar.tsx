import { useOktaAuth } from "@okta/okta-react";
import { Link, NavLink } from "react-router-dom";
import { SpinnerLoading } from "../../util/SpinnerLoading";
export const Navbar = () => {
    const { oktaAuth, authState } = useOktaAuth();

    if (!authState) {
        return <SpinnerLoading />
    }

    const handleLogout = async () => {
        try {
            console.log('Logging out...');
            await oktaAuth.signOut();
            console.log('Logged out successfully');

            // Clear local tokens and session
            localStorage.removeItem('okta-token-storage');
            sessionStorage.removeItem('okta-token-storage');
        } catch (error) {
            console.error('Error during logout', error);
        }
    };

    console.log(authState);
    return (

        <section data-bs-version="5.1" className="menu menu3 cid-uhCiPZpBJT" id="menu3-d">

            <nav className="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
                <div className="container-fluid">
                    <div className="navbar-brand">
                        <span className="navbar-logo">

                            <img src="assets/images/vehicle_rental_logo.png" alt="Mobirise Website Builder" style={{ height: '3.0rem' }} />

                        </span>
                        <span className="navbar-caption-wrap"><a className="navbar-caption text-white display-7">Vehicle
                            Rental</a></span>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-bs-toggle="collapse"
                        data-target="#navbarSupportedContent" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <div className="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav nav-dropdown" data-app-modern-menu="true">
                            <li className="nav-item">
                                <NavLink className="nav-link link text-white display-4" to='/home'>Home</NavLink>
                            </li>


                            <li className="nav-item">
                                <NavLink className="nav-link link text-white display-4" to='/searchvehicles'>Search Vehicles</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link link text-white display-4" to='/notifications'>Notifications</NavLink>
                            </li>

                            {authState.isAuthenticated &&

                                <li className="nav-item">
                                    <NavLink className="nav-link link text-white display-4" to='/myBookings'>My Bookings</NavLink>

                                </li>
                            }

                            {authState.isAuthenticated && (authState.accessToken?.claims?.userType === 'admin') &&

                                <li className="nav-item">
                                    <NavLink className="nav-link link text-white display-4" to='/admin'>Admin</NavLink>

                                </li>
                            }

                        </ul>

                        <div className="navbar-buttons mbr-section-btn">
                            <ul className='navbar-nav ms-auto'>
                                {!authState.isAuthenticated ?
                                    <li>
                                        <Link type='button' className='btn btn-primary display-4' to='/login'>Sign in</Link>
                                    </li>
                                    :
                                    <li>
                                        <button className='btn btn-primary display-4' onClick={handleLogout}>Logout</button>
                                    </li>
                                }
                            </ul>

                        </div>
                    </div>
                </div>
            </nav>
        </section>
    )
}