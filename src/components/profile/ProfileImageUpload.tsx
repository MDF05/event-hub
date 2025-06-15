"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Camera } from "lucide-react";

interface ProfileImageUploadProps {
  currentImage: string | null;
  onImageUpload: (file: File) => Promise<void>;
}

export default function ProfileImageUpload({
  currentImage,
  onImageUpload,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      setIsUploading(true);
      await onImageUpload(file);
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
        {(previewUrl || currentImage) && (
          <Image
            src={previewUrl || currentImage || ""}
            alt="Profile"
            fill
            className="object-cover"
          />
        )}
        {!previewUrl && !currentImage && (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? "Uploading..." : "Change Photo"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Max file size: 5MB
        </p>
      </div>
    </div>
  );
} 