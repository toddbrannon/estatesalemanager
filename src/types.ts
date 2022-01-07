import { ObjectId } from 'mongodb';

export interface Sale {
  _id?: ObjectId,
  jobName: string,
  hoursStagingBudget: string,
  market: string,
  hoursStagingActual: string,
  minimumBase: string,
  services: string,
  minimumActual: string,
  saleDate: string,
  hoursEstateSaleBudget: string,
  minimumDiscount: string,
  cashier: string,
  hoursEstateSaleActual: string,
  salesPerson: string,
  disposalFee: string,
  posId: string,
  grossSalesBudget: string,
  splitFee: string,
  disposalLoadCount: string,
  trailerNumber: string,
  grossSalesActualClover: string,
  disposalVendorCost: string,
  openingDay: string,
  adView: string,
  grossSales8To10: string,
  transactions8To10: string,
  emailsSent: string,
  grossSalesOpeningDay: string,
  transactionsOpeningDay: string,
  clientName: string,
  checkPayableTo: string,
  paymentDueDate: string,
  clientEmail: string,
  transactionTotal: string,
  clientMailingAddress1: string,
  clientMailingAddress2: string,
  clientMailingCity: string,
  clientMailingState: string,
  grossSalesCreditDebit: string,
  grossSalesCash: string,
  cashOutsideClover: string,
  commissionRate: string,
  clientPostalCode: string,
  taxesFees: string,
  additionalDonationLoanCost: string,
  courtesyDiscount: string,
  postSaleHours: string
}

export const getSaleSectionConfig = () => {
  return [
    {
      "name": "Client Info",
      "fields": [
        "jobName",
        "market",
        "services",
        "clientName",
        "clientEmail",
        "saleDate",
        "clientMailingAddress1",
        "clientMailingAddress2",
        "clientMailingCity",
        "clientMailingState",
        "clientPostalCode",
        "checkPayableTo",
        "paymentDueDate",
        "salesPerson",
        "hoursStagingBudget",
        "hoursEstateSaleBudget",
        "grossSalesBudget",
        "splitFee",
        "minimumBase",
        "minimumActual",
        "minimumDiscount"
      ]
    },
    {
      "name": "Sale Setup",
      "fields": [
        "hoursStagingActual",
        "hoursEstateSaleActual",
        "grossSalesActualClover",
        "cashier",
        "openingDay",
        "posId",
        "trailerNumber",
        "adView",
        "emailsSent"
      ]
    },
    {
      "name": "Sale Results",
      "fields": [
        "transactionsOpeningDay",
        "transactions8To10",
        "transactionTotal",
        "cashOutsideClover",
        "grossSalesOpeningDay",
        "grossSales8To10",
        "grossSalesCreditDebit",
        "grossSalesCash",
        "commissionRate",
        "taxesFees"
      ]
    },
    {
      "name": "Post Sale",
      "fields": [
        "disposalFee",
        "disposalLoadCount",
        "disposalVendorCost",
        "additionalDonationLoanCost",
        "courtesyDiscount",
        "postSaleHours"
      ]
    }
  ]

}