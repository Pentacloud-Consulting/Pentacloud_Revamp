export const convertToWebP = (file: File, quality = 0.75): Promise<File> => {
  return new Promise((resolve, reject) => {
    // We no longer skip webp files, because the user might upload a massive 2.5MB webp file.
    // We want to force it through the compressor to shrink dimensions and lower quality to 0.75.
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate dimensions to ensure the image isn't massively oversized. Max width 1920px.
        const MAX_WIDTH = 1920;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }
        
        // Use better interpolation for downscaling if supported by the browser
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error('Canvas to Blob conversion failed'));
          }
          
          // Generate new filename
          const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.') || file.name;
          const newFileName = `${fileNameWithoutExtension}.webp`;
          
          const webpFile = new File([blob], newFileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          
          resolve(webpFile);
        }, 'image/webp', quality);
      };
      
      img.onerror = (error) => reject(new Error('Failed to load image for conversion.'));
    };
    
    reader.onerror = (error) => reject(new Error('Failed to read file.'));
  });
};
