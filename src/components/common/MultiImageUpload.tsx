import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
}

export function MultiImageUpload({ value = [], onChange, maxImages = 5 }: MultiImageUploadProps) {
    const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: number }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        // Check max images limit
        if (value.length + files.length > maxImages) {
            toast.error(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Validate all files first
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB limit`);
                return;
            }
        }

        // Upload files
        const uploadPromises = files.map(async (file) => {
            const fileId = `${file.name}-${Date.now()}`;

            try {
                // Simulate progress
                setUploadingFiles(prev => ({ ...prev, [fileId]: 0 }));

                const progressInterval = setInterval(() => {
                    setUploadingFiles(prev => ({
                        ...prev,
                        [fileId]: Math.min((prev[fileId] || 0) + 10, 90)
                    }));
                }, 200);

                const imageUrl = await uploadService.uploadImage(file);

                clearInterval(progressInterval);
                setUploadingFiles(prev => ({ ...prev, [fileId]: 100 }));

                setTimeout(() => {
                    setUploadingFiles(prev => {
                        const newState = { ...prev };
                        delete newState[fileId];
                        return newState;
                    });
                }, 500);

                return imageUrl;
            } catch (error) {
                setUploadingFiles(prev => {
                    const newState = { ...prev };
                    delete newState[fileId];
                    return newState;
                });
                toast.error(`Failed to upload ${file.name}`);
                throw error;
            }
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            onChange([...value, ...uploadedUrls]);
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
        toast.success('Image removed');
    };

    const hasUploading = Object.keys(uploadingFiles).length > 0;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg border-2 overflow-hidden">
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {/* Upload Progress Indicators */}
                {Object.entries(uploadingFiles).map(([fileId, progress]) => (
                    <div key={fileId} className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <Progress value={progress} className="w-full h-2" />
                        <span className="text-xs text-muted-foreground mt-2">{progress}%</span>
                    </div>
                ))}

                {/* Upload Button */}
                {value.length < maxImages && !hasUploading && (
                    <div
                        className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-8 w-8 text-slate-500 mb-2" />
                        <span className="text-xs text-slate-500">Upload Image</span>
                        <span className="text-xs text-muted-foreground mt-1">
                            {value.length}/{maxImages}
                        </span>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={hasUploading}
            />

            <p className="text-xs text-muted-foreground">
                Max {maxImages} images. Each image must be less than 5MB.
            </p>
        </div>
    );
}
