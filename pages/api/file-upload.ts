import formidable from "formidable";
import { NextApiHandler, NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/save-model");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    }
  }

  console.log("This is options", options)

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const HandleFileUpload: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public/save-model"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public/save-model"));
  }

  await readFile(req, true);
  res.json({ done: "ok" });
};

export default HandleFileUpload;
