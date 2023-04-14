import { Request, Response, NextFunction } from 'express';
import * as csv from 'fast-csv';
import multer from 'multer';

// Set up multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  // Set file filter to only allow CSV files
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

export const csvParser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use multer to upload a single CSV file with field name 'csv'
    upload.single('csv')(req, res, (err: any) => {
      if (err) {
        return next(err);
      }

      // Convert file buffer to a string
      const file = req.file.buffer.toString();
      const rows = [];

      // Parse the CSV file using fast-csv
      csv
        .parseString(file, { headers: true })
        .on('error', (error) => {
          console.error(error);
          return next(error);
        })
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          req.body = {
            ...req.body,
            data: rows
          };

          return next();
        });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error parsing CSV file' });
  }
};
