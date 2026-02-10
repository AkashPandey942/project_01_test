import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    isLoading?: boolean;
}

export function ImageUpload({ value, onChange, isLoading = false }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            const imageUrl = await uploadService.uploadImage(file);
            onChange(imageUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
            >
                {value ? (
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
                    disabled={isLoading}
                />
            </div>
            {value && (
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
        </div>
    );
}
