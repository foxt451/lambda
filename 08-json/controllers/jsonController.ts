import { RequestHandler } from "express";
import JsonModel, { IJson } from "../models/jsonModel.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { v2 as cloudinary } from "cloudinary";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const getBucketName = () => {
  const bucket_name = process.env.BUCKET_NAME;
  if (!bucket_name) {
    throw new Error("Missing bucket name in config");
  }
  return bucket_name;
};

const storeJson: RequestHandler = async (req, res) => {
  const id: string = req.params.id;
  const body: object = req.body;
  const bucket_name = getBucketName();
  const filename = `${uuidv4()}.json`;

  const json: IJson = {
    name: id,
    path: filename,
  };
  const session = await mongoose.startSession();
  const opts = { session };
  try {
    session.startTransaction();
    const result = await JsonModel.create([json], opts);
    const data = await s3
      .putObject({
        Bucket: bucket_name,
        Key: filename,
        Body: JSON.stringify(body),
      })
      .promise();
    console.log(data);
    await session.commitTransaction();
    res.send(result);
  } catch (e: any) {
    await session.abortTransaction();
    if (e.code === 11000) {
      throw new BadRequestError("Entry with such name already exists");
    }
    throw e;
  } finally {
    session.endSession();
  }
};

const retrieveJson: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const json: IJson | null = await JsonModel.findOne({ name: id });
  if (!json) {
    throw new NotFoundError("json with such name not found");
  }
  const bucket_name = getBucketName();
  const body = await s3
    .getObject({ Bucket: bucket_name, Key: json.path })
    .promise();
  res.type("json").send(body.Body);
};

export { storeJson, retrieveJson };
