import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/messages/newVehicle');
        // Filter notifications containing the word "available"
        const filteredNotifications = response.data.filter((notification: string) =>
          notification.toLowerCase().includes('available')
        );
        setNotifications(filteredNotifications);
      } catch (err) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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
        {notifications.length === 0 ? (
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