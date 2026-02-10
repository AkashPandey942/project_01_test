import { apiClient } from './api-client';

export const fetchUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};
