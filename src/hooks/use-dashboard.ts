import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  lowStockCount: number;
  averagePrice: number;
  averageRating: number;
  categoriesCount: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [productsRes, usersRes, categoriesRes] = await Promise.all([
        apiClient.get('/products?limit=100'), // Fetch 100 to calculate averages
        apiClient.get('/users?limit=0'), // Just get total
        apiClient.get('/products/categories'),
      ]);

      const products = productsRes.data.products;
      const totalProducts = productsRes.data.total;
      const totalUsers = usersRes.data.total;
      const categoriesCount = categoriesRes.data.length;

      const lowStockCount = products.filter((p: any) => p.stock < 10).length;
      const totalRatings = products.reduce((acc: number, p: any) => acc + p.rating, 0);
      const totalPrices = products.reduce((acc: number, p: any) => acc + p.price, 0);

      return {
        totalProducts,
        totalUsers,
        lowStockCount,
        averageRating: totalRatings / products.length,
        averagePrice: totalPrices / products.length,
        categoriesCount,
        products, // Return products for charts
      };
    },
  });
}
