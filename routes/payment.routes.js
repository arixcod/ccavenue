var express = require("express");

var paymentController = require("../controllers/payment.controller");
var paymentRouter = express.Router();

paymentRouter.post(
  "/request/phone",
  paymentController.handlePaymentControllerPhone
);
paymentRouter.post(
  "/response",
  paymentController.handleResponsePaymentController
);

module.exports = paymentRouter;