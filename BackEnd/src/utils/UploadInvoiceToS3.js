const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function uploadInvoiceToS3(localFilePath, s3Folder = "Invoives") {
  const fileContent = fs.readFileSync(localFilePath);
  const fileName = path.basename(localFilePath);
  const s3Key = `${s3Folder}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: "application/pdf",
    ACL: "public-read",
  };

  await s3.upload(params).promise();
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
}

module.exports = { uploadInvoiceToS3 };
