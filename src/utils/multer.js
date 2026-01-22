import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
}
});

export const upload = multer({
    storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
fileFilter: (req, file, cb) => {
    if (
        file.mimetype === 'application/json' ||
        file.mimetype === 'text/csv'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV or JSON files allowed'));
    }
}
});
