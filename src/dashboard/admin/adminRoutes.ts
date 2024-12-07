import express from "express";
import { AdminController } from '../admin/adminController'
// import { createCompany } from "./companyController";
const adminRoutes = express.Router();
const company = new AdminController();

// companyRoutes.post("/", createCompany);
adminRoutes.post('/request-otp', company.requestOTP)
adminRoutes.post('/verify-otp', company.verifyOTPAndCreateUser)
export default adminRoutes;
