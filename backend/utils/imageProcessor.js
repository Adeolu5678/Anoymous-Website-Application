const sharp = require('sharp');
const path = require('path');

const imageProcessor = {
    async optimizeImage(file) {
        try {
            const filename = `processed-${Date.now()}${path.extname(file.originalname)}`;
            const outputPath = path.join(__dirname, '..', 'uploads', filename);

            // Process image
            await sharp(file.buffer)
                // Resize image (maintain aspect ratio, fit inside 1200x1200)
                .resize(1200, 1200, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                // Convert to WebP format for better compression
                .webp({ quality: 80 })
                // Save to disk
                .toFile(outputPath);

            return {
                filename,
                path: outputPath,
                url: `/uploads/${filename}`
            };
        } catch (error) {
            console.error('Image processing error:', error);
            throw new Error('Failed to process image');
        }
    }
};

module.exports = imageProcessor; 