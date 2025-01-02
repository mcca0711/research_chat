// utils/security.ts

/**
 * Sanitize a file name by removing invalid characters.
 * Prevent directory traversal or invalid file names.
 * @param fileName - The file name to sanitize
 * @returns A sanitized file name
 */
export const sanitizeFileName = (fileName: string): string => {
    return fileName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  };
  
  /**
   * Validate the file type against allowed MIME types.
   * @param mimeType - The MIME type of the file
   * @returns True if the MIME type is allowed, otherwise false
   */
  export const validateFileType = (mimeType: string): boolean => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return allowedMimeTypes.includes(mimeType);
  };
  