import React, { useState } from 'react';
import { useProducts, useDeleteProduct, useCategories } from '@/hooks/use-products';
import { Product } from '@/types/product.types';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Plus, Filter, ArrowUpDown, Loader2 } from 'lucide-react';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchParams } from 'react-router-dom';

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get values from URL or defaults
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';

    const limit = 10;
    const debouncedSearch = useDebounce(search, 500);

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
            prev.set('page', '1'); // Reset page on search
            return prev;
        });
    };

    const handleCategoryChange = (value: string) => {
        setSearchParams(prev => {
            if (value && value !== 'all') prev.set('category', value);
            else prev.delete('category');
            prev.set('page', '1');
            return prev;
        });
    };

    const { data, isLoading, error } = useProducts(page, limit, debouncedSearch, category);
    const { data: categories } = useCategories();
    const deleteProduct = useDeleteProduct();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>('');

    const handleDelete = async () => {
        if (selectedProduct) {
            await deleteProduct.mutateAsync(selectedProduct.id);
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    };

    // Client-side sorting
    const sortedProducts = React.useMemo(() => {
        if (!data?.products) return [];
        const products = [...data.products];

        if (sortBy === 'price-asc') return products.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') return products.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating-desc') return products.sort((a, b) => b.rating - a.rating);
        if (sortBy === 'stock-asc') return products.sort((a, b) => a.stock - b.stock);
        if (sortBy === 'title-asc') return products.sort((a, b) => a.title.localeCompare(b.title));

        return products;
    }, [data?.products, sortBy]);

    if (error) {
        return <div className="p-4 text-red-500">Error loading products.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">
                        Manage your product catalog.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-950 p-4 rounded-lg border">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map((cat: any) => (
                            <SelectItem key={cat.slug || cat} value={cat.slug || cat}>
                                {cat.name || cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No sorting</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                        <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
                        <SelectItem value="title-asc">Title: A to Z</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : data?.products?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedProducts.map((product: Product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 rounded-lg">
                                            <AvatarImage src={product.thumbnail} alt={product.title} />
                                            <AvatarFallback className="rounded-lg">{product.title?.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{product.title}</span>
                                            <span className="text-xs text-muted-foreground">{product.brand}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">
                                            {product.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={product.stock < 10 ? "text-red-500 font-bold" : ""}>
                                                {product.stock}
                                            </span>
                                            {product.stock < 10 && <Badge variant="destructive" className="h-5 px-1 py-0 text-[10px]">Low</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className="mr-1">{product.rating}</span>
                                            <span className="text-yellow-500">★</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleView(product)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium">Page {page}</span>
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

            {/* Product Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                            {selectedProduct ? 'Make changes to the product here.' : 'Add a new product to your catalog.'}
                        </DialogDescription>
                    </DialogHeader>
                    <ProductForm
                        initialData={selectedProduct || undefined}
                        onSuccess={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete
                            <span className="font-bold"> {selectedProduct?.title}</span> from your catalog.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteProduct.isPending}
                        >
                            {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
            />
        </div>
    );
}
