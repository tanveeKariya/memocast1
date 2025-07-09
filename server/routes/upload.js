// server/routes/upload.js
import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/extract-text', upload.single('file'), async (req, res) => {
  const file = req.file;
  const filePath = file.path;
  const ext = file.originalname.split('.').pop()?.toLowerCase();

  try {
    let extractedText = '';

    if (ext === 'pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      // fallback for .txt, .js, .py, .json, etc.
      extractedText = await fs.readFile(filePath, 'utf-8');
    }

    await fs.unlink(filePath); // cleanup
    return res.json({ success: true, text: extractedText.trim() });
  } catch (error) {
    console.error('Text extraction error:', error);
    return res.status(500).json({ success: false, message: 'Text extraction failed' });
  }
});

export default router;
