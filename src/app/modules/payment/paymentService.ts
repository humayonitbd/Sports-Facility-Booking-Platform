import { join } from "path";
import { verifyPayment } from "./paymentMethod";
import { readFileSync } from "fs";
import { Booking } from "../booking/booking.model";

const conformationService = async (transactionId: string, status:string) => {
  const verifyResponse = await verifyPayment(transactionId);
  console.log("verify response", verifyResponse);
  let result;
  let message;
  if (verifyResponse.pay_status === "Successful") {
    result = await Booking.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: "Paid",
      }
    );
    message="Payment Successfull!!"
  }else{
    message = "Payment Failed!!";
  }

  const filePath = join(__dirname, "../../../views/conformation.payment.html");
  let template = readFileSync(filePath, 'utf-8');
  template = template.replace("{{message}}", message);


  return template;
};

export const paymentService = {
    conformationService
}