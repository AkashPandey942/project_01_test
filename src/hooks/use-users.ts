import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export const useUsers = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => {
        const skip = (page - 1) * limit;
        if (search) {
            return userService.search(search);
        }
        return userService.getAll(limit, skip);
    },
    // keepPreviousData: true, // Removed for v5 compatibility, handled by placeholderData if needed
  });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.getById(id),
        enabled: !!id,
    });
};
