const nodeCCAvenue = require("node-ccavenue"); // assuming this is your CCAvenue library
const CryptoJS = require("crypto-js"); // for encryption

class PaymentController {
  
  // Method to handle payment initiation
  static async handlePaymentControllerPhone(req, res, next) {
    try {
      const ccav = new nodeCCAvenue.Configure({
        ...req.body.keys,
        merchant_id: "MERCHANT_ID",
      });
      const orderParams = {
        redirect_url: encodeURIComponent(
          `https://DOMAIN/api/response?access_code=${req.body.keys?.access_code}&working_key=${req.body.keys?.working_key}`
        ),
        cancel_url: encodeURIComponent(
          `https://DOMAIN/api/response?access_code=${req.body.keys?.access_code}&working_key=${req.body.keys?.working_key}`
        ),
        billing_name: "Name of the customer",
        currency: "INR",
        ...req.body.orderParams,
      };
      const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
      res.setHeader("content-type", "application/json");
      res.status(200).json({
        payLink: `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&access_code=${req.body.keys.access_code}&encRequest=${encryptedOrderData}`,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to handle payment response
  
  static async handleResponsePaymentController(req, res, next) {
    try {
      const encryption = req.body.encResp;
      const ccav = new nodeCCAvenue.Configure({
        ...req.query,
        merchant_id: "MERCHANT_ID",
      });
      const ccavResponse = ccav.redirectResponseToJson(encryption);
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(ccavResponse),
        "Astro"
      ).toString();
      
      if (ccavResponse["order_status"] == "Success") {
        res.redirect(
          `https://DOMAIN/transaction?type=success&val=${ciphertext}`
        );
      } else {
        res.redirect(`https://DOMAIN/transaction?val=${ciphertext}`);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
