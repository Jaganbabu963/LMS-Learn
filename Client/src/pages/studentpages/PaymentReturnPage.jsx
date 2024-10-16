import { captureOrderService } from "@/services/index.js";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentReturnPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // http://localhost:5173/payment-return?paymentId=PAYID-M4F545I7D218265WM242073W&token=EC-46494814TB979900R&PayerID=B9XF9FHCMX22G

  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
        const response = await captureOrderService(paymentId, payerId, orderId);

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }
      capturePayment();
    }
  }, [paymentId, payerId]);

  return (
    <div className="text-2xl font-semibold italic">
      Payment Processing.....Please wait
    </div>
  );
};

export default PaymentReturnPage;
