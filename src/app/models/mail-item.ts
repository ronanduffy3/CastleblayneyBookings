export interface MailItem {
    to: string;
    message: {
      subject: string;
      html: string;
    };
}
