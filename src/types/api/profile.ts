export interface CurrentUser {
  id: number;
  full_name: string | null;
  email: string | null;
  gender: number | null;
  phone_number: string | null;
  profile_completed: boolean;
}
