import prisma from "../config/prisma";
import cloudinary from "../config/cloudinary";
import fs from "fs";

export const saveDocuments = async (
  studentId: number,
  files: any
) => {

  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new Error("Admission not found");
  }

  if (
    student.status !== "REGISTERED" &&
    student.status !== "CORRECTION_REQUIRED" &&
    student.status !== "REJECTED"
  ) {
    throw new Error(`Editing not allowed after submission (Current status: ${student.status})`);
  }

  const documentData: any = {};
  
  const uploadToCloudinary = async (fileArray: any) => {
    if (!fileArray || !fileArray[0]) return undefined;
    const file = fileArray[0];
    
    const isPdf = file.mimetype === "application/pdf";

    const result = await cloudinary.uploader.upload(file.path, {
        folder: "erp_documents",
        resource_type: isPdf ? "raw" : "image",
        type: "upload",
        access_mode: "public",
    });
    
    // Clean up local temp file
    try { fs.unlinkSync(file.path); } catch (e) {}
    
    // Store the secure_url and fileType as an object
    return { 
      url: result.secure_url, 
      fileType: isPdf ? "pdf" : "image" 
    };
  };

  if (files.sslcMarkscard) documentData.sslcMarkscard = await uploadToCloudinary(files.sslcMarkscard);
  if (files.pucMarkscard) documentData.pucMarkscard = await uploadToCloudinary(files.pucMarkscard);
  if (files.casteCertificate) documentData.casteCertificate = await uploadToCloudinary(files.casteCertificate);
  if (files.incomeCertificate) documentData.incomeCertificate = await uploadToCloudinary(files.incomeCertificate);
  if (files.transferCertificate) documentData.transferCertificate = await uploadToCloudinary(files.transferCertificate);
  if (files.migrationCertificate) documentData.migrationCertificate = await uploadToCloudinary(files.migrationCertificate);
  if (files.studyCertificate) documentData.studyCertificate = await uploadToCloudinary(files.studyCertificate);
  if (files.photo) documentData.photo = await uploadToCloudinary(files.photo);
  if (files.signature) documentData.signature = await uploadToCloudinary(files.signature);

  if (Object.keys(documentData).length === 0) {
    const existing = await prisma.studentdocuments.findUnique({
      where: { studentId }
    });
    return existing;
  }

  const documents = await prisma.studentdocuments.upsert({
    where: { studentId },
    update: documentData,
    create: {
      studentId,
      ...documentData
    }
  });

  return documents;
};