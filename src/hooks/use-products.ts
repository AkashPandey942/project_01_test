import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { toast } from 'sonner';

export const useProducts = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => {
        const skip = (page - 1) * limit;
        if (search) {
            return productService.search(search);
        }
        return productService.getAll(limit, skip);
    },
  });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: productService.getCategories,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully');
        },
        onError: () => {
            toast.error('Failed to create product');
        }
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, product }: { id: number; product: any }) => productService.update(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully');
        },
        onError: () => {
            toast.error('Failed to update product');
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete product');
        }
    });
};
