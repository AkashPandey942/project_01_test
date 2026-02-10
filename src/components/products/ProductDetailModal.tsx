import { Product } from '@/types/product.types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductDetailModalProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Images */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                        {product.images?.slice(0, 4).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${product.title} ${idx + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Brand</p>
                            <p className="font-medium">{product.brand}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <Badge variant="secondary" className="capitalize">
                                {product.category}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium text-lg">${product.price}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Discount</p>
                            <p className="font-medium">{product.discountPercentage}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Stock</p>
                            <p className={`font-medium ${product.stock < 10 ? 'text-red-500' : ''}`}>
                                {product.stock} units
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1">
                                <span className="font-medium">{product.rating}</span>
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="text-sm">{product.description}</p>
                    </div>

                    {/* Additional Info */}
                    {product.warrantyInformation && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Warranty</p>
                            <p className="text-sm">{product.warrantyInformation}</p>
                        </div>
                    )}
                    {product.shippingInformation && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Shipping</p>
                            <p className="text-sm">{product.shippingInformation}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
