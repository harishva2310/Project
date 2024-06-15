import AddNewVehicle from "../AddNewVehicle/AddNewVehicle";
import MyCarousel from "./components/Carousel";
import { ExploreVehicle } from "./components/ExploreVehicle";

export const HomePage = () => {
    return (
        <>
        <ExploreVehicle />
        <MyCarousel />
        <AddNewVehicle />
        </>
    );
}

export default HomePage;