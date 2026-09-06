export interface User {
    name: string;
    role: string
};

export interface AuthContextType {
  registrationMessage: string | null;
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<string>;
  refreshAccessToken: () => Promise<void>;
  register: (name: string, email: string, role: string, password: string) => Promise<void>;
  clearAuthState: () => void;
  handleAuthError: () => void;
}

