const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

module.exports = s3; 