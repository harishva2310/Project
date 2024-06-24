class LocationModel {

    location_id: number;
    location_name: string;
    location_description: string;
    location_address: string;
    location_city: string;
    location_state: string;
    location_country: string;
    location_zip: string;

    constructor(
        location_id: number,
        location_name: string,
        location_description: string,
        location_address: string,
        location_city: string,
        location_state: string,
        location_country: string,
        location_zip: string
    ) {

        this.location_id = location_id;
        this.location_name = location_name;
        this.location_description=location_description;
        this.location_address=location_address;
        this.location_city=location_city;
        this.location_country=location_country;
        this.location_state=location_state;
        this.location_zip=location_zip;

    }
}
export default LocationModel;