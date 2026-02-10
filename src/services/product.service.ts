import { apiClient } from '@/lib/api-client';
import { Product } from '@/types/product.types';

export const productService = {
  getAll: async (limit = 10, skip = 0) => {
    const response = await apiClient.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  },

  getByCategory: async (category: string) => {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
  },

  getCategories: async () => {
      const response = await apiClient.get('/products/categories');
      return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>) => {
    const response = await apiClient.post('/products/add', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
