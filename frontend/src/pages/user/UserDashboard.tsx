import { useEffect, useState } from "react";
import { getMyProfile, MeResponse } from "@/api/userApi";
import { getMyBookings } from "@/api/bookingsApi";

export default function UserDashboard() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const profile = await getMyProfile();
      const bookings = await getMyBookings();

      setMe(profile);
      setBookingsCount(bookings.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!me) return <p className="p-6">No user data found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>

      <div className="border rounded p-4 space-y-1">
        <p><b>Name:</b> {me.firstName} {me.lastName}</p>
        <p><b>Email:</b> {me.email}</p>
        <p><b>Department:</b> {me.department}</p>
        <p><b>Role:</b> {me.role}</p>
        <p><b>Total My Bookings:</b> {bookingsCount}</p>
      </div>
    </div>
  );
}
