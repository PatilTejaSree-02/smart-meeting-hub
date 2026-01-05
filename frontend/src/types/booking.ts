export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  tenantId: number;
  startTime: string;
  endTime: string;
  status: string;
}

export interface CreateBookingRequest {
  roomId: number;
  userId: number;
  tenantId: number;
  startTime: string;
  endTime: string;
}
