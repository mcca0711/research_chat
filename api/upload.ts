import { VercelRequest, VercelResponse } from '@vercel/node';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse'); // Use CommonJS require for pdf-parse
import { sanitizeFileName, validateFileType } from '../utils/security';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }) => validateFileType(mimetype || ''),
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the files' });
    }

    const file = files['file-input'] as File;
    if (!file || !validateFileType(file.mimetype || '')) {
      return res.status(400).json({ error: 'Unsupported or missing file type' });
    }

    const sanitizedFileName = sanitizeFileName(file.originalFilename || 'unknown');
    const sanitizedFilePath = path.join(uploadDir, sanitizedFileName);

    try {
      fs.renameSync(file.filepath, sanitizedFilePath);
      let extractedText = '';

      if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(sanitizedFilePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (file.mimetype === 'text/plain') {
        extractedText = fs.readFileSync(sanitizedFilePath, 'utf-8');
      }

      if (!extractedText || !extractedText.trim()) {
        return res.status(400).json({ error: 'No meaningful text could be extracted from the file.' });
      }

      res.status(200).json({
        success: true,
        extractedText,
      });
    } catch (error) {
      console.error('Error processing the file:', error);
      return res.status(500).json({ error: 'Error processing the file' });
    }
  });
};
