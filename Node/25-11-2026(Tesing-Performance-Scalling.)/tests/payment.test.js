import test from "node:test";
import assert from "node:assert/strict";

import { createPaymentService } from "../src/services/payment.service.js";

// TEST 1: Successful payment
test("should process payment successfully", async () => {

    const mockPaymentGateway = {
        async createPayment(amount) {
            return {
                paymentId: "pay_123",
                status: "completed",
                amount
            };
        }
    };

    const paymentService = createPaymentService(mockPaymentGateway);

    const result = await paymentService.processPayment(1000);

    assert.equal(result.success, true);
    assert.equal(result.paymentId, "pay_123");
    assert.equal(result.amount, 1000);

});


// TEST 2: Failed payment
test("should throw error when payment fails", async () => {

    const mockPaymentGateway = {
        async createPayment(amount) {
            return {
                paymentId: "pay_456",
                status: "failed",
                amount
            };
        }
    };

    const paymentService = createPaymentService(mockPaymentGateway);

    await assert.rejects(
        paymentService.processPayment(1000),
        {
            message: "Payment failed"
        }
    );

});


// TEST 3: Invalid payment amount
test("should reject invalid payment amount", async () => {

    const mockPaymentGateway = {
        async createPayment(amount) {
            return {
                paymentId: "pay_789",
                status: "completed",
                amount
            };
        }
    };

    const paymentService = createPaymentService(mockPaymentGateway);

    await assert.rejects(
        paymentService.processPayment(-100),
        {
            message: "Invalid payment amount"
        }
    );

});