import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendWelcomeEmail(email: string, name: string) {
    console.log(`Welcome email sent to ${email}`);
  }

  async sendInvestmentConfirmation(email: string, amount: number, businessName: string) {
    console.log(`Investment confirmation sent to ${email}`);
  }

  async sendKYCDecision(email: string, decision: string) {
    console.log(`KYC decision email sent to ${email}: ${decision}`);
  }
}
