import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {rooms.map((room: any) => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <p>Capacity: {room.capacity}</p>
        </div>
      ))}
    </div>
  );
}
