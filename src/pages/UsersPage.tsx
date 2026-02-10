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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Eye } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchParams } from 'react-router-dom';
import React from 'react';

export default function UsersPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get values from URL or defaults
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || '';

    const limit = 10;
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, error } = useUsers(page, limit, debouncedSearch);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Update URL helpers
    const setPage = (newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', String(newPage));
            return prev;
        });
    };

    const handleSearch = (value: string) => {
        setSearchParams(prev => {
            if (value) prev.set('search', value);
            else prev.delete('search');
            prev.set('page', '1');
            return prev;
        });
    };

    const handleSortChange = (value: string) => {
        setSearchParams(prev => {
            if (value && value !== 'none') prev.set('sort', value);
            else prev.delete('sort');
            return prev;
        });
    };

    // Client-side sorting
    const sortedUsers = React.useMemo(() => {
        if (!data?.users) return [];
        const users = [...data.users];

        if (sortBy === 'name-asc') return users.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        if (sortBy === 'name-desc') return users.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
        if (sortBy === 'email-asc') return users.sort((a, b) => a.email.localeCompare(b.email));
        if (sortBy === 'company-asc') return users.sort((a, b) => (a.company?.title || '').localeCompare(b.company?.title || ''));

        return users;
    }, [data?.users, sortBy]);

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
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No sorting</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        <SelectItem value="email-asc">Email: A to Z</SelectItem>
                        <SelectItem value="company-asc">Company: A to Z</SelectItem>
                    </SelectContent>
                </Select>
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
                            <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : data?.users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedUsers.map((user: User) => (
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
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedUser(user);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between p-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.total || 0)} of {data?.total || 0} users
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1 || isLoading}
                        >
                            Previous
                        </Button>
                        <span className="text-sm font-medium">
                            Page {page} of {Math.ceil((data?.total || 0) / limit)}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={isLoading || (data?.total && page * limit >= data.total)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Comprehensive information for {selectedUser?.firstName} {selectedUser?.lastName}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <div className="flex flex-col items-center gap-3 pb-4 border-b">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={selectedUser.image} alt={selectedUser.username} />
                                    <AvatarFallback className="text-2xl">{selectedUser.firstName[0]}{selectedUser.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                                    {selectedUser.role && (
                                        <Badge variant="secondary" className="mt-2">{selectedUser.role}</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Contact Information</h4>
                                <div className="grid gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Email:</span>
                                        <span className="text-sm text-muted-foreground">{selectedUser.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Phone:</span>
                                        <span className="text-sm text-muted-foreground">{selectedUser.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            {selectedUser.company && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Professional</h4>
                                    <div className="grid gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Company:</span>
                                            <span className="text-sm text-muted-foreground">{selectedUser.company.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Title:</span>
                                            <span className="text-sm text-muted-foreground">{selectedUser.company.title}</span>
                                        </div>
                                        {selectedUser.company.department && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Department:</span>
                                                <span className="text-sm text-muted-foreground">{selectedUser.company.department}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Address Information */}
                            {selectedUser.address && (
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Address</h4>
                                    <div className="text-sm text-muted-foreground">
                                        <p>{selectedUser.address.address}</p>
                                        <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.postalCode}</p>
                                        <p>{selectedUser.address.country}</p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Additional Information</h4>
                                <div className="grid gap-3">
                                    {selectedUser.age && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Age:</span>
                                            <span className="text-sm text-muted-foreground">{selectedUser.age}</span>
                                        </div>
                                    )}
                                    {selectedUser.birthDate && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Birth Date:</span>
                                            <span className="text-sm text-muted-foreground">{selectedUser.birthDate}</span>
                                        </div>
                                    )}
                                    {selectedUser.bloodGroup && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Blood Group:</span>
                                            <span className="text-sm text-muted-foreground">{selectedUser.bloodGroup}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
