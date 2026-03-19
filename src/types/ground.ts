export interface Ground {
  _id: string;
  name: string;
  type: "Football" | "Cricket" | "Basketball" | "Tennis" | "Badminton";
  location: string;
  pricePerHour: number;
  rating: number;
  features: string[];
  image: string;
  description: string;
  availability: string[];
  nightprice: number;
}

export interface Booking {
  id: number;
  groundId: number;
  groundName: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled";
}
export interface Admin {
  name: string;
  email: string;
  profile?: string;
  contact: string;
  password: string;
  scanner: string;
}
export const base_url = "/api";
export const upload_base_url = "/api/photo";
