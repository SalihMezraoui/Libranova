class PaymentHistory {
  id: number;                
  userEmail: string;         
  invoiceReference: string;  
  amount: number;            
  paymentDate: string;       
  methodType: string;        

  constructor(id: number, userEmail: string, invoiceReference: string, amount: number, paymentDate: string, methodType: string) {
    this.id = id;
    this.userEmail = userEmail;
    this.invoiceReference = invoiceReference;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.methodType = methodType;
  }
}

export default PaymentHistory;
