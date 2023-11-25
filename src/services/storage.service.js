import * as admin from 'firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';

/**
 * @param {Multer.File} fileData
 * @param {string} folder
 * @returns {Promise<{filename: string, publicUrl: string}>}
 */
async function uploadFile(fileData, folder) {
  if (!fileData || !folder) throw new Error('File and folder must be provided');

  const bucket = admin.storage().bucket();
  const filename = `${folder}/${Date.now()}-${fileData.originalname.trim().replace(/\s/g, '_')}`;

  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({ contentType: fileData.mimetype });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });
    blobStream.on('finish', async () => {
      console.log(`File ${filename} uploaded successfully!`);
      const publicUrl = await getDownloadURL(blob);
      resolve({ filename, publicUrl });
    });
    blobStream.end(fileData.buffer);
  });
}

/**
 * @param {string} fileKey
 * @returns {Promise<boolean>}
 */
async function deleteFile(fileKey) {
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileKey);
    await file.delete();
    return true;
  } catch (error) {
    console.log('Delete file failed: ' + error.message);
    return false;
  }
}

export default { uploadFile, deleteFile };
