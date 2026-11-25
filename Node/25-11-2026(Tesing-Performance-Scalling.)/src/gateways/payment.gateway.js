export const paymentGateway = {

    async createPayment(amount) {

        console.log("Mock payment gateway called");

        return {
            paymentId: "pay_123",
            status: "completed",
            amount
        };
    }
};