import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import { SpinnerLoading } from "../../../util/SpinnerLoading";
import VehicleModel from "../../../model/VehicleModel";
import { fetchVehicleData } from "../../../service/FetchVehicle";
import blobToBase64 from "../../../util/ConvertBlobtoBase64";
import { ReturnVehicle } from "./ReturnVehicle";


const MyCarousel: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadVehicles() {
            try {
                const data = await fetchVehicleData();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, []);

    if (loading) {
        return <SpinnerLoading />;
    }

    const chunkArray = (array: any[], chunkSize: number) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const vehicleChunks = chunkArray(vehicles, 3);

    return (
        <>
            <div className="homepage-carousel-title">
                <h3>Find your next ride with us.</h3>
            </div>
            <Carousel 
            
            className="homepage-carousel">
                {vehicleChunks.map((vehicleChunk, index) => (
                    <Carousel.Item key={index} className="carousel-item">
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            {vehicleChunk.map(vehicle => (
                                <ReturnVehicle key={vehicle.vehicle_id} vehicle={vehicle} />
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            
            </Carousel>
        </>
    );

    /*return (
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='homepage-carousel-title'>
                <h3>Find your next "I stayed up too late reading" vehicle.</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {vehicles.slice(0, 3).map(vehicle => (
                                <ReturnVehicle vehicle={vehicle} key ={vehicle.vehicle_id} />
                            ))}
                        </div>
                    </div>
                    
                </div>
                <button className='carousel-control-prev' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button className='carousel-control-next' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>

            
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnVehicle vehicle={vehicles[1]} key={vehicles[1].vehicle_id}/>
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>View More</Link>
            </div>
        </div>
    );*/

};

export default MyCarousel;