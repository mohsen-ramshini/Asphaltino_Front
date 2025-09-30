export type LoginFormValues = {
  username: string;
  password: string;
};


export type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
};


export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}


export interface LogoutResponse {
  detail: string; 
}


// Additional auth types
export interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}


export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: 'admin' | 'patient' | 'caregiver';
  status: 'active' | 'inactive';
}


export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

