import { useState } from 'react';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types/api.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = useUsers(page, limit, debouncedSearch);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (error) {
        return <div className="p-4 text-red-500">Error loading users.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Manage and view user accounts.
                    </p>
                </div>
            </div>

            <div className="flex items-center bg-white dark:bg-slate-950 p-4 rounded-lg border">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on search
                        }}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>City</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : data?.users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.users.map((user: User) => (
                                <TableRow
                                    key={user.id}
                                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <TableCell>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image} alt={user.username} />
                                            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.company?.title}</TableCell>
                                    <TableCell>{user.address?.city}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-end space-x-2 p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium">Page {page}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={isLoading || (data?.total && page * limit >= data.total)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* User Details Modal */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Detailed information for {selectedUser?.firstName} {selectedUser?.lastName}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-2 mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={selectedUser.image} alt={selectedUser.username} />
                                    <AvatarFallback className="text-2xl">{selectedUser.firstName[0]}{selectedUser.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                <span className="text-sm text-muted-foreground">@{selectedUser.username}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Email:</span>
                                <span className="col-span-3">{selectedUser.email}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Phone:</span>
                                <span className="col-span-3">{selectedUser.phone}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Company:</span>
                                <span className="col-span-3">{selectedUser.company?.title}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Address:</span>
                                <span className="col-span-3">
                                    {selectedUser.address?.address}, {selectedUser.address?.city}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
