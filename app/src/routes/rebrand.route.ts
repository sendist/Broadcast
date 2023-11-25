import express from "express";
import { Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body } from "express-validator";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";

const router = express.Router()

const postRebrand = async (req: Request, res: Response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return sendResponse({ res, error: "No files were uploaded.", status: 400 });
    }

    const logo = req.files.logo as UploadedFile;
    const fileName = logo.name;

    // Save the file to the public folder
    const filePath = path.join(__dirname, "../../public", fileName);
    await logo.mv(filePath);

    return sendResponse({
        res,
        data: { 
            error: null,
            data: {
                message: "File uploaded and brand information saved successfully." 
            },
        }
    });
};

router.post(
    "/",
    validate([
        body("fileName").notEmpty(),
    ]),
    postRebrand
);

export default router;
