class Message {
    subject: string;
    inquiry: string;
    id?: number;
    userEmail?: string;
    adminEmail?: string;
    response?: string;
    answered?: boolean;

    constructor(subject: string, inquiry: string) {
        this.subject = subject;
        this.inquiry = inquiry;
    }
}
export default Message;
