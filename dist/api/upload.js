"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfParse = require('pdf-parse'); // Use CommonJS require for pdf-parse
const security_1 = require("../utils/security");
exports.default = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const uploadDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const form = new formidable_1.default.IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filter: ({ mimetype }) => (0, security_1.validateFileType)(mimetype || ''),
    });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing the files' });
        }
        const file = files['file-input'];
        if (!file || !(0, security_1.validateFileType)(file.mimetype || '')) {
            return res.status(400).json({ error: 'Unsupported or missing file type' });
        }
        const sanitizedFileName = (0, security_1.sanitizeFileName)(file.originalFilename || 'unknown');
        const sanitizedFilePath = path_1.default.join(uploadDir, sanitizedFileName);
        try {
            fs_1.default.renameSync(file.filepath, sanitizedFilePath);
            let extractedText = '';
            if (file.mimetype === 'application/pdf') {
                const dataBuffer = fs_1.default.readFileSync(sanitizedFilePath);
                const pdfData = await pdfParse(dataBuffer);
                extractedText = pdfData.text;
            }
            else if (file.mimetype === 'text/plain') {
                extractedText = fs_1.default.readFileSync(sanitizedFilePath, 'utf-8');
            }
            if (!extractedText || !extractedText.trim()) {
                return res.status(400).json({ error: 'No meaningful text could be extracted from the file.' });
            }
            res.status(200).json({
                success: true,
                extractedText,
            });
        }
        catch (error) {
            console.error('Error processing the file:', error);
            return res.status(500).json({ error: 'Error processing the file' });
        }
    });
};
