import { Router } from "express";
import { paymentController } from "./payment.controller";


const router = Router();

// Route to create an order
router.post("/conformation", paymentController.conformPaymentController);

export const paymentRoute = router;
