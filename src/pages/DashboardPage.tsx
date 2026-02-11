import React from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, AlertTriangle, TrendingUp, Star, LayoutGrid, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboardStats();

    // Process data for charts
    const categoryData = React.useMemo(() => {
        if (!stats?.products) return [];

        const catMap = new Map();
        stats.products.forEach((p: any) => {
            catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
        });

        return Array.from(catMap.entries()).map(([name, value]) => ({ name, value })).slice(0, 5);
    }, [stats]);


    const priceRangeData = React.useMemo(() => {
        if (!stats?.products) return [];
        const ranges = { '0-50': 0, '51-100': 0, '101-500': 0, '500+': 0 };
        stats.products.forEach((p: any) => {
            if (p.price <= 50) ranges['0-50']++;
            else if (p.price <= 100) ranges['51-100']++;
            else if (p.price <= 500) ranges['101-500']++;
            else ranges['500+']++;
        });
        return Object.entries(ranges).map(([name, value]) => ({ name, value }));
    }, [stats]);

    const topRatedData = React.useMemo(() => {
        if (!stats?.products) return [];
        return [...stats.products]
            .sort((a: any, b: any) => b.rating - a.rating)
            .slice(0, 10)
            .map((p: any) => ({ name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title, rating: p.rating }));
    }, [stats]);

    const recentProducts = React.useMemo(() => {
        if (!stats?.products) return [];
        // Assuming the API returns products in some order, we'll just take the first 5 as "recent" for this demo
        // In a real app, we'd sort by created_at if available
        return stats.products.slice(0, 5);
    }, [stats]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Failed to load dashboard data.</div>;
    }


    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard title="Total Products" value={stats?.totalProducts} icon={Package} subtext="+20.1% from last month" />
                <StatsCard title="Total Users" value={stats?.totalUsers} icon={Users} subtext="+180.1% from last month" />
                <StatsCard title="Low Stock Items" value={stats?.lowStockCount} icon={AlertTriangle} className="text-red-500" />
                <StatsCard title="Avg. Price" value={`$${stats?.averagePrice.toFixed(2)}`} icon={TrendingUp} />
                <StatsCard title="Avg. Rating" value={stats?.averageRating.toFixed(1)} icon={Star} />
                <StatsCard title="Categories" value={stats?.categoriesCount} icon={LayoutGrid} />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>Price distribution across products</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={priceRangeData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>Product distribution by top categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Rated Products Chart */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 Rated Products</CardTitle>
                        <CardDescription>Highest rated products in your catalog</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topRatedData} layout="vertical" margin={{ left: 50 }}>
                                <XAxis type="number" domain={[0, 5]} hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="rating" fill="#facc15" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Products Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Products</CardTitle>
                        <CardDescription>Latest products added to the store.</CardDescription>
                    </div>
                    <Button asChild size="sm" variant="outline">
                        <Link to="/products" className="flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Rating</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentProducts.map((product: any) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell className="capitalize">{product.category}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>
                                        <span className={product.stock < 10 ? "text-red-500 font-bold" : ""}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span>{product.rating}</span>
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 ml-1" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, subtext, className }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn("h-4 w-4 text-muted-foreground", className)} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
            </CardContent>
        </Card>
    );
}
