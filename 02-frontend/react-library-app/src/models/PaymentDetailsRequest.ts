class PaymentDetailsRequest {
  amount: number;
  currencyCode: string;
  recipientEmail: string | undefined;

  constructor(amount: number, currencyCode: string, recipientEmail: string | undefined) {
    this.amount = amount;
    this.currencyCode = currencyCode;
    this.recipientEmail = recipientEmail;
  }
}

export default PaymentDetailsRequest;
