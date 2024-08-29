import { Request, Response } from 'express';
import { paymentService } from './paymentService';

const conformPaymentController = async (req: Request, res: Response) => {
  const { transactionId, status } = req.query;
  const result = await paymentService.conformationService(
    transactionId as string,
    status as string,
  );
  res.send(result);
};

export const paymentController = {
  conformPaymentController,
};
