export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  gender: 0 | 1 | 2;
  address: string;
  pin: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer" | string;
  profile_completed: boolean;
}
