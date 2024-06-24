class UserModel{
    user_id: number;
    user_first_name: string;
    user_last_name: string;
    user_driver_license_num: string;
    user_address: string;
    user_email: string;
    
    constructor (
        user_id: number,
    user_first_name: string,
    user_last_name: string,
    user_driver_license_num: string,
    user_address: string,
    user_email: string,
    ){
        this.user_id=user_id;
        this.user_first_name=user_first_name;
        this.user_last_name=user_last_name;
        this.user_driver_license_num=user_driver_license_num;
        this.user_address=user_address;
        this.user_email=user_email;
    }
}

export default UserModel;
