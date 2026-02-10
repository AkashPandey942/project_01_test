import React from 'react';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, AlertTriangle, TrendingUp, Star, LayoutGrid, Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboardStats();

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
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
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
