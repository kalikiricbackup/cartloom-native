export interface Address {
  id: number;
  label: string | null;
  address: string;
  street: string | null;
  city: string | null;
  state: string | null;
  pin: string | null;
  created_at: string;
}
