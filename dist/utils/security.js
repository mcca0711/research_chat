"use strict";
// utils/security.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileType = exports.sanitizeFileName = void 0;
/**
 * Sanitize a file name by removing invalid characters.
 * Prevent directory traversal or invalid file names.
 * @param fileName - The file name to sanitize
 * @returns A sanitized file name
 */
const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
};
exports.sanitizeFileName = sanitizeFileName;
/**
 * Validate the file type against allowed MIME types.
 * @param mimeType - The MIME type of the file
 * @returns True if the MIME type is allowed, otherwise false
 */
const validateFileType = (mimeType) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];
    return allowedMimeTypes.includes(mimeType);
};
exports.validateFileType = validateFileType;
