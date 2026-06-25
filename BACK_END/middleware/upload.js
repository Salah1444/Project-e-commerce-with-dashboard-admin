import multer from "multer";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files (jpeg, png, webp, gif) are allowed."));
  }
};

/**
 * Creates a multer instance configured for a specific upload directory.
 */
const createUploader = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });

  return multer({ storage, fileFilter, limits: { fileSize: FILE_SIZE_LIMIT } });
};

export const uploadCategoryImage = createUploader("uploads/category");
export const uploadProductImage = createUploader("uploads/products");
