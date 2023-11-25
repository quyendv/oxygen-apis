import multer from 'multer';

const uploader = multer({
  // dest: 'uploads/', // save to server
  storage: multer.memoryStorage(), // save to memory
});

export default uploader;
