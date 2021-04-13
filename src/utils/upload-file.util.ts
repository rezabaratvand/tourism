import { BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new BadRequestException('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const storage = (path: string) =>
  diskStorage({
    destination: (req, file, cb) => cb(null, path),
    filename: (req, file, cb) =>
      cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`),
  });

//! upload single image
export const uploadSingleFile = (fieldName: string, path: string) =>
  FileInterceptor(fieldName, { storage: storage(path), fileFilter: imageFilter });

//! upload multiple images identified with a single field name
export const uploadMultiFiles = (
  fieldName: string,
  path: string,
  maxCount: number = 10,
) =>
  FilesInterceptor(fieldName, maxCount, {
    storage: storage(path),
    fileFilter: imageFilter,
  });
