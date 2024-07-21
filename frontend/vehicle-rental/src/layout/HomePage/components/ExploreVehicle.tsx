import { Link } from "react-router-dom";

export const ExploreVehicle = () => {
    return (
        /*<div className='bg-dark header'>
            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>Find your next adventure</h1>
                    <p className='col-md-8 fs-4'>Where would you like to go next?</p>
                    <Link type='button' className='btn btn-primary text-white' to='/searchvehicles'>
                        Explore top rides</Link>
                </div>
            </div>
        </div>*/

        <section data-bs-version="5.1" className="header4 cid-uhHkGHhP3a mbr-fullscreen" id="header4-g">
            <div className="mbr-overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="content-wrap">
                        <h1 className="mbr-section-title mbr-fonts-style mbr-white mb-3 display-1">
                            <strong>Find your next adventure</strong>
                        </h1>

                        <p className="mbr-fonts-style mbr-text mbr-white mb-3 display-7">
                        Where would you like to go next?
                        </p>

                        <div className="mbr-section-btn">
                            <Link type='button' className="btn btn-primary display-4" to='/searchvehicles'>Explore top rides</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ExploreVehicle;