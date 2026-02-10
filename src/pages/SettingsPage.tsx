import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthStore } from '@/stores/use-auth-store';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ThemeMode = 'light' | 'dark' | 'system';
type DensityMode = 'comfortable' | 'compact';
type SidebarMode = 'expanded' | 'collapsed';

export default function SettingsPage() {
    const { user, logout } = useAuthStore();

    // Theme Settings
    const [theme, setTheme] = useState<ThemeMode>(() => {
        return (localStorage.getItem('theme') as ThemeMode) || 'system';
    });

    // Display Settings
    const [density, setDensity] = useState<DensityMode>(() => {
        return (localStorage.getItem('density') as DensityMode) || 'comfortable';
    });

    const [pageSize, setPageSize] = useState(() => {
        return localStorage.getItem('pageSize') || '10';
    });

    const [sidebarDefault, setSidebarDefault] = useState<SidebarMode>(() => {
        return (localStorage.getItem('sidebarDefault') as SidebarMode) || 'expanded';
    });

    // Apply theme on mount and when changed
    useEffect(() => {
        const applyTheme = () => {
            if (theme === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (systemPrefersDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } else if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        // Listen for system theme changes
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme();
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [theme]);

    const handleThemeChange = (newTheme: ThemeMode) => {
        setTheme(newTheme);
        toast.success(`Theme changed to ${newTheme}`);
    };

    const handleDensityChange = (newDensity: DensityMode) => {
        setDensity(newDensity);
        localStorage.setItem('density', newDensity);
        toast.success(`Density changed to ${newDensity}`);
    };

    const handlePageSizeChange = (newSize: string) => {
        setPageSize(newSize);
        localStorage.setItem('pageSize', newSize);
        toast.success(`Default page size set to ${newSize}`);
    };

    const handleSidebarDefaultChange = (newMode: SidebarMode) => {
        setSidebarDefault(newMode);
        localStorage.setItem('sidebarDefault', newMode);
        // Update current sidebar state
        localStorage.setItem('sidebarOpen', JSON.stringify(newMode === 'expanded'));
        toast.success(`Sidebar default set to ${newMode}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account and application preferences.
                </p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Your account information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" value={user?.email || ''} disabled />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" value={user ? `${user.firstName} ${user.lastName}` : ''} disabled />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" value={user?.username || ''} disabled />
                    </div>
                    <div className="pt-2">
                        <Button variant="destructive" onClick={logout}>Logout</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of the application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">
                            Select your preferred color theme.
                        </p>
                        <RadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as ThemeMode)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                                    <Sun className="h-4 w-4" />
                                    Light
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                                    <Moon className="h-4 w-4" />
                                    Dark
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" />
                                <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                                    <Monitor className="h-4 w-4" />
                                    System
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>
                        Configure how content is displayed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Density */}
                    <div className="space-y-3">
                        <Label>Table Density</Label>
                        <p className="text-sm text-muted-foreground">
                            Choose how compact tables should appear.
                        </p>
                        <RadioGroup value={density} onValueChange={(value) => handleDensityChange(value as DensityMode)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="comfortable" id="comfortable" />
                                <Label htmlFor="comfortable" className="cursor-pointer">
                                    Comfortable
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="compact" id="compact" />
                                <Label htmlFor="compact" className="cursor-pointer">
                                    Compact
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Default Page Size */}
                    <div className="space-y-3">
                        <Label htmlFor="pageSize">Default Page Size</Label>
                        <p className="text-sm text-muted-foreground">
                            Number of items to show per page in tables.
                        </p>
                        <Select value={pageSize} onValueChange={handlePageSizeChange}>
                            <SelectTrigger id="pageSize" className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 items</SelectItem>
                                <SelectItem value="20">20 items</SelectItem>
                                <SelectItem value="50">50 items</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sidebar Default State */}
                    <div className="space-y-3">
                        <Label>Sidebar Default State</Label>
                        <p className="text-sm text-muted-foreground">
                            Choose the default state of the sidebar on page load.
                        </p>
                        <RadioGroup value={sidebarDefault} onValueChange={(value) => handleSidebarDefaultChange(value as SidebarMode)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expanded" id="expanded" />
                                <Label htmlFor="expanded" className="cursor-pointer">
                                    Expanded
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="collapsed" id="collapsed" />
                                <Label htmlFor="collapsed" className="cursor-pointer">
                                    Collapsed
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
