import axios from "axios"
import config from "../../config";

export const initiatePayment = async ( paymentData :any) => {
  try {
    const response = await axios.post(config.payment_api_url!, {
      store_id: config.payment_storeId,
      signature_key: config.payment_signeture_key,
      tran_id: paymentData.transactionId,
      success_url: `http://localhost:5000/api/conformation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `http://localhost:5000/api/conformation?status=failed`,
      cancel_url: "http://localhost:5173/",
      amount: paymentData.totalPrice,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentData.custommerName,
      cus_email: paymentData.custommerEmail,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "N/A",
      cus_phone: paymentData.custommerPhone,
      type: "json",
    });

    return response.data;
  } catch (error) {
    throw new Error('Payment initiation Failed!');
  }
};

export const verifyPayment = async(tnxId:string)=>{
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.payment_storeId,
        signature_key: config.payment_signeture_key,
        type: "json",
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Payment validation Failed!");
  }
}