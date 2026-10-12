/**
 * Automatic Image to WebP Converter
 * Converts any image format (JPG, PNG, GIF, BMP, HEIC) to modern .webp format
 * Calculates compression ratio and file size savings
 */

export interface WebpConversionResult {
  file: File;
  blob: Blob;
  previewUrl: string;
  originalSize: number;
  webpSize: number;
  savingsPercent: number;
  originalName: string;
  newName: string;
  width: number;
  height: number;
}

export async function convertImageToWebp(
  file: File,
  quality: number = 0.85,
  maxWidth: number = 2000,
  maxHeight: number = 2000
): Promise<WebpConversionResult> {
  return new Promise((resolve, reject) => {
    // If it's already a webp, we still optimize dimensions/quality if needed
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image into memory'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale proportionally if larger than maximum bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to initialize 2D canvas context'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Failed to create WebP blob'));
            }

            const cleanBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${cleanBaseName}.webp`;

            const webpFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const webpSize = blob.size;
            const savingsPercent = Math.max(
              0,
              Math.round(((originalSize - webpSize) / originalSize) * 100)
            );

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              file: webpFile,
              blob,
              previewUrl,
              originalSize,
              webpSize,
              savingsPercent,
              originalName: file.name,
              newName: newFileName,
              width,
              height,
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g. 1.2 MB or 450 KB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

