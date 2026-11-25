export function createPaymentService(paymentGateway) {

    async function processPayment(amount) {

        // Validate amount
        if (amount <= 0) {
            throw new Error("Invalid payment amount");
        }

        // Call payment gateway
        const gatewayResponse =
            await paymentGateway.createPayment(amount);

        // Check payment status
        if (gatewayResponse.status !== "completed") {
            throw new Error("Payment failed");
        }

        // Return final result
        return {
            success: true,
            paymentId: gatewayResponse.paymentId,
            amount: amount
        };
    }

    return {
        processPayment
    };
}