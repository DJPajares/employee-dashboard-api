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

      // Check if CSV file is missing
      if (!req.file) {
        return next(new Error('CSV file is missing'));
      }

      // Convert file buffer to a string
      const file = req.file.buffer.toString();
      const rows = [];
      // Set to keep track of unique id and login values
      const idSet = new Set();
      const loginSet = new Set();

      csv
        .parseString(file, { headers: true, comment: '#', ignoreEmpty: true })
        .on('error', (error) => {
          console.error(error);
          return next(error);
        })
        .on('data', (row) => {
          if (
            row['id'] !== undefined &&
            row['login'] !== undefined &&
            row['name'] !== undefined &&
            row['salary'] !== undefined &&
            !idSet.has(row['id']) &&
            !loginSet.has(row['login']) &&
            row['salary'] >= 0
          ) {
            // Add id and login values to sets to ensure uniqueness
            idSet.add(row['id']);
            loginSet.add(row['login']);
            // Add row to rows array
            rows.push(row);
          } else {
            return next(new Error('Invalid row in CSV file'));
          }
        })
        .on('end', () => {
          if (rows.length === 0) {
            return next(new Error('No valid rows found in CSV file'));
          }

          req.body = {
            ...req.body,
            csvData: rows
          };

          return next();
        });
    });
  } catch (error) {
    console.error(error);
    return next(new Error('Error parsing CSV file'));
  }
};
