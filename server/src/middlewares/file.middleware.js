import multer, { memoryStorage } from "multer";

const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, //3 MB
});

export default upload;
