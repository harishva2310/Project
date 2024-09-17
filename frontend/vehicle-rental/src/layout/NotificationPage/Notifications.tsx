import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';

export interface UserInfo {
    name?: string;
    email?: string;
    // Add any other claims you expect to receive
}
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { oktaAuth, authState } = useOktaAuth();
  const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
  const [bookingNotifications, setBookingNotifications]=useState<string[]>([]);


    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/messages/newVehicle`);
        // Filter notifications containing the word "available"
        const filteredNotifications = response.data.filter((notification: string) =>
          notification.toLowerCase().includes('available')
        );
        setNotifications((prevNotifications) => {
            const newNotifications = filteredNotifications.filter(
              (notification :string) => !prevNotifications.includes(notification)
            );
            return [...prevNotifications, ...newNotifications];
          });
      } catch (err) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    
  useEffect(() => {
    console.log(authState, oktaAuth)
    if (!authState || !authState.isAuthenticated) {
        // When user isn't authenticated, forget any user info
        setUserInfo(null);
    } else {

        oktaAuth.token.getUserInfo().then(info => {
            console.log(info)
            setUserInfo(info);
        }).catch((err) => {
            console.error(err);
        });
    }
}, [authState, oktaAuth]);

  useEffect(() => {
    const fetchBookingNotifications = async () => {
      try {
        if(authState?.isAuthenticated){
        const response = await axios.get(`${process.env.REACT_APP_API}/api/messages/userBookingNotifications`);
        // Filter notifications containing the word "available"
        const email = userInfo?.email as string | undefined;
        const filteredNotifications = email
        ? response.data.filter((notification: string) =>
            notification.includes(email)
          )
        : [];
        
        setNotifications((prevNotifications) => {
            const newNotifications = filteredNotifications.filter(
              (notification :string) => !prevNotifications.includes(notification)
            );
            return [...prevNotifications, ...newNotifications];
          });
        }
        fetchNotifications();
      } catch (err) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingNotifications();
  }, [userInfo?.email]);

  if (loading) {
    return <div className="text-center mt-5">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Notifications</h2>
      <div className="list-group">
        {notifications.length === 0 && bookingNotifications.length === 0? (
          <div className="list-group-item">No new notifications.</div>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="list-group-item list-group-item-action">
              <p>{notification}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;