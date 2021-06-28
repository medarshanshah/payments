require('dotenv').config()
const {Router} = require('express')
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const crypto = require('crypto')
const { requireAuth } = require('../middleware/authmiddleware')


const paymentRouter = Router()

let paymentId = null

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET
})


paymentRouter.get("/", (req, res) => {
    res.render("payment", { key: process.env.RAZORPAY_KEY_ID });
});

/**
 * @swagger
 * /payment/verification:
 *  post:
 *      summary: Request to add product into cart
 *      tags: [Cart]
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              productId:
 *                                  type: string
 *      parameters:
 *            - in: body
 *              name: Product id
 *              required: true
 *              description: The cart id 
 *      responses:
 *          '200':
 *              description: A successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              productId:
 *                                  type: string
 *          '400':
 *              description: Bad Request. Error in Retrieving products
 */
paymentRouter.post("/verification", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { status: "failure" };
    if (expectedSignature === req.body.razorpay_signature)
        paymentId = req.body.razorpay_payment_id
      response = { 
        status: "success"
     };
    res.send(response);
  });


/**
 * @swagger
 * /payment:
 *  post:
 *      summary: Request to add product into cart
 *      tags: [Cart]
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              productId:
 *                                  type: string
 *      parameters:
 *            - in: body
 *              name: Product id
 *              required: true
 *              description: The cart id 
 *      responses:
 *          '200':
 *              description: A successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              productId:
 *                                  type: string
 *          '400':
 *              description: Bad Request. Error in Retrieving products
 */
paymentRouter.post("/", (req, res) => {
    const params = req.body
    console.log(params)
    razorpay.orders
      .create(params)
      .then((data) => {
        res.send({ sub: data, status: "success" });
      })
      .catch((error) => {
        res.send({ sub: error, status: "failed" });
      });
  });
  
paymentRouter.get("/completion",async (req, res) => {
    await res.json(paymentId);
    console.log(paymentId)
});
module.exports = paymentRouter

 