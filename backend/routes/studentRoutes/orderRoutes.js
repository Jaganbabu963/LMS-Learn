import express from "express";
import {
  createOrder,
  capturePaymentAndFinalizeOrder,
} from "../../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

export default router;
