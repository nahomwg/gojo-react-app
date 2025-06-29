import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPropertyImage } from '../../services/supabase';
import { toast } from 'react-hot-toast';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  propertyId?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizePerImage = 5,
  propertyId = 'temp'
}) => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));

    // Validate file sizes
    const validFiles = newFiles.filter(fileObj => {
      const sizeInMB = fileObj.file.size / (1024 * 1024);
      if (sizeInMB > maxSizePerImage) {
        toast.error(`${fileObj.file.name} is too large. Maximum size is ${maxSizePerImage}MB.`);
        return false;
      }
      return true;
    });

    // Check total count
    const totalFiles = imageFiles.length + validFiles.length + images.length;
    if (totalFiles > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);
    
    // Auto-upload files
    validFiles.forEach(fileObj => {
      uploadFile(fileObj);
    });
  }, [imageFiles, images, maxImages, maxSizePerImage, propertyId]);

  const uploadFile = async (fileObj: ImageFile) => {
    setImageFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, uploading: true } : f
    ));

    try {
      const { data, error } = await uploadPropertyImage(fileObj.file, propertyId);
      
      if (error) {
        throw new Error(error);
      }

      setImageFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, uploading: false, uploaded: true, url: data }
          : f
      ));

      // Add to images array
      onImagesChange([...images, data]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setImageFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, uploading: false, error: errorMessage }
          : f
      ));
      
      toast.error(`Failed to upload ${fileObj.file.name}: ${errorMessage}`);
    }
  };

  const removeFile = (fileId: string) => {
    const fileObj = imageFiles.find(f => f.id === fileId);
    if (fileObj?.url) {
      // Remove from images array
      onImagesChange(images.filter(img => img !== fileObj.url));
    }
    
    setImageFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const removeExistingImage = (imageUrl: string) => {
    onImagesChange(images.filter(img => img !== imageUrl));
  };

  const retryUpload = (fileId: string) => {
    const fileObj = imageFiles.find(f => f.id === fileId);
    if (fileObj) {
      setImageFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, error: undefined } : f
      ));
      uploadFile(fileObj);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: images.length + imageFiles.length >= maxImages
  });

  const totalImages = images.length + imageFiles.filter(f => f.uploaded).length;
  const isMaxReached = totalImages >= maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!isMaxReached && (
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-800/50'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? 'Drop images here' : 'Upload property images'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag & drop or click to select • Max {maxImages} images • Up to {maxSizePerImage}MB each
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Image Grid */}
      {(images.length > 0 || imageFiles.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing Images */}
          <AnimatePresence>
            {images.map((imageUrl, index) => (
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => removeExistingImage(imageUrl)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    Cover
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Uploading/New Images */}
          <AnimatePresence>
            {imageFiles.map((fileObj) => (
              <motion.div
                key={fileObj.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
              >
                <img
                  src={fileObj.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Loading Overlay */}
                {fileObj.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Error Overlay */}
                {fileObj.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex flex-col items-center justify-center text-white p-2">
                    <AlertCircle className="w-6 h-6 mb-1" />
                    <p className="text-xs text-center">{fileObj.error}</p>
                    <button
                      onClick={() => retryUpload(fileObj.id)}
                      className="text-xs underline mt-1 hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Success Indicator */}
                {fileObj.uploaded && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Remove Button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Progress */}
      {imageFiles.some(f => f.uploading) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Uploading {imageFiles.filter(f => f.uploading).length} image(s)...
            </span>
          </div>
        </div>
      )}

      {/* Image Count */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {totalImages} of {maxImages} images uploaded
        </span>
        {isMaxReached && (
          <span className="text-amber-600 dark:text-amber-400">
            Maximum images reached
          </span>
        )}
      </div>
    </div>
  );
};