import { CustomUserClaims, UserClaims } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const AdminPage = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(authState, oktaAuth)
        if (!authState || !authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
            setLoading(false);
        } else {

            oktaAuth.token.getUserInfo().then(info => {
                console.log(info)
                setUserInfo(info);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [authState, oktaAuth]);
    if (authState?.accessToken?.claims.userType === undefined) {
        navigate("/home");
      }
    

    return (
        <div className="container mt-5">
            <h2>Admin Console</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Functions</th>
                        <th>Description</th>
                        
                    </tr>
                </thead>
                <tbody>
                    
                        <tr>
                            <td><Link type='button' className="btn btn-primary display-4" to='/addnewvehicle'>Add New Vehicle</Link></td>
                            <td>Add new vehicles to the inventory</td>
                        </tr>
                        <tr>
                            <td><Link type='button' className="btn btn-primary display-4" to='/addvehiclelocations'>Add Vehicle to Location</Link></td>
                            <td>Add vehicles already in inventory to the locations</td>
                        </tr>
                    
                </tbody>
            </table>
        </div>
    );
}
export default AdminPage;