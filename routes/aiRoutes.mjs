import express from "express";
import multer from "multer";
import { createFile, transformCode } from "../helpers/aiHelper.mjs";
import { ensureAuthenticated } from "../middleware/authMiddleware.mjs";

const router = express.Router();
const upload = multer();

router.post(
  "/test-prompt",
  ensureAuthenticated,
  upload.single("file"),
  async (req, res) => {
    const { model, instructions } = req.body;

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const file = req.file;
    const content = file.buffer.toString("utf8");

    try {
    

      const completion = await createFile(content, model, instructions);
      const explanation = completion.text;
      console.log(completion.text);
      res.json({
        message: "File processed successfully!",
        data: {
          fileName: file.originalname,
          prompt: explanation,
        },
      });
    } catch (error) {
      console.error("Failed to process file:", error);
      res.status(500).send("Failed to process file");
    }
  }
);


router.post('/transform-code', ensureAuthenticated, async (req, res) => {
  const { content, transformInstructions } = req.body;

  try {
      const result = await transformCode(content, transformInstructions);
      console.log(result.text)
      res.json(result.text);
  } catch (error) {
      console.error('Failed to transform code:', error);
      res.status(500).send('Failed to transform code');
  }
});


export default router;
