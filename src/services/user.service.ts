import { apiClient } from '@/lib/api-client';

export const userService = {
  getAll: async (limit = 10, skip = 0) => {
    const response = await apiClient.get(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get(`/users/search?q=${query}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};
