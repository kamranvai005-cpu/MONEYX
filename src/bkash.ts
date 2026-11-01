import { BkashGateway } from 'bkash-payment-gateway';

export type Intent = 'sale' | 'authorization';

export interface IBkashConstructor {
  baseURL: string;
  key: string;
  username: string;
  password: string;
  secret: string;
}

export interface ICreatePayment {
  amount: number;
  orderID: string;
  intent: Intent;
  merchantAssociationInfo?: string;
}

export interface IBkashCreatePaymentResponse {
  paymentID: string;
  createTime: string;
  orgLogo: string;
  orgName: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface IBkashExecutePaymentResponse {
  paymentID: string;
  createTime: string;
  updateTime: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface IBkashQueryPaymentResponse {
  paymentId: string;
  createTime: string;
  updateTime: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: Intent;
  merchantInvoiceNumber: string;
  refundAmount: string;
}

export interface IBkashSearchTransactionResponse {
  trxID: string;
  transactionStatus: string;
  transactionType: string;
  amount: string;
  currency: string;
  customerMsisdn: string;
  organizationShortCode: string;
  initiationTime: string;
  completedTime: string;
}

export interface IBkashRefundResponse {
  completedTime: string;
  transactionStatus: string;
  originalTrxID: string;
  refundTrxID: string;
  amount: string;
  currency: string;
  charge: string;
}

export const bkashConfig: IBkashConstructor = {
  baseURL:
    process.env.BKASH_BASE_URL ||
    'https://checkout.sandbox.bka.sh/v1.2.0-beta', // do not add a trailing slash
  key: process.env.BKASH_API_KEY || 'abcdxx2369',
  username: process.env.BKASH_USERNAME || 'bkashTest',
  password: process.env.BKASH_PASSWORD || 'bkashPassword1',
  secret: process.env.BKASH_API_SECRET || 'bkashSup3rS3cRet',
};

const bkash = new BkashGateway(bkashConfig);

export { BkashGateway };
export default bkash;
