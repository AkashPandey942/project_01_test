import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    isLoading?: boolean;
}

export function ImageUpload({ value, onChange, isLoading = false }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const imageUrl = await uploadService.uploadImage(file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            onChange(imageUrl);
            toast.success('Image uploaded successfully');

            setTimeout(() => {
                setUploadProgress(0);
                setIsUploading(false);
            }, 500);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
            setUploadProgress(0);
            setIsUploading(false);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative overflow-hidden group"
                onClick={() => !isUploading && !isLoading && fileInputRef.current?.click()}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <Progress value={uploadProgress} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                    </div>
                ) : value ? (
                    <img src={value} alt="Preview" className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition" />
                ) : (
                    <div className="flex flex-col items-center text-slate-500">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-xs">Upload</span>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading || isUploading}
                />
            </div>
            {value && !isUploading && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange('')}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs h-8"
                >
                    Remove
                </Button>
            )}
            <p className="text-xs text-muted-foreground text-center">
                Max 5MB. JPG, PNG, GIF supported.
            </p>
        </div>
    );
}
