const multer = require('multer');
const imageProcessor = require('../utils/imageProcessor');

// Configure multer to use memory storage for processing
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function(req, file, cb) {
        // Accept only images
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('image');

// Wrapper middleware to handle multer errors and process images
const uploadMiddleware = async (req, res, next) => {
    upload(req, res, async function(err) {
        try {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                console.error('Multer error:', err);
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        message: 'File is too large. Maximum size is 10MB' 
                    });
                }
                return res.status(400).json({ 
                    message: `Upload error: ${err.message}` 
                });
            } else if (err) {
                // An unknown error occurred
                console.error('Upload error:', err);
                return res.status(500).json({ 
                    message: err.message || 'Error uploading file' 
                });
            }

            // If file was uploaded, process it
            if (req.file) {
                try {
                    const processedImage = await imageProcessor.optimizeImage(req.file);
                    req.file.url = processedImage.url;
                    req.file.path = processedImage.path;
                } catch (processError) {
                    console.error('Image processing error:', processError);
                    return res.status(500).json({ 
                        message: 'Error processing image' 
                    });
                }
            }

            // Everything went fine
            next();
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ 
                message: 'An unexpected error occurred' 
            });
        }
    });
};

module.exports = uploadMiddleware; 