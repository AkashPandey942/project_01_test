export interface ApiResponse<T> {
  products: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
  phone?: string;
  role?: string;
  age?: number;
  birthDate?: string;
  bloodGroup?: string;
  company?: {
      name?: string;
      title: string;
      department?: string;
  };
  address?: {
      address: string;
      city: string;
      state?: string;
      postalCode?: string;
      country?: string;
  }
}
