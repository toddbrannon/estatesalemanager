export const saleToInvoice = sale => {
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function toCurrency(str) {
        return isNumber(str) ? `$ ${parseFloat(str).toFixed(2)}` : 'NaN'
    }

    const transactions8To10 = isNumber(sale.transactions8To10) ? sale.transactions8To10 : (sale.transactions8To10.trim() === '' ? '0' : 'NaN')
    const transactionsOpeningDay = isNumber(sale.transactionsOpeningDay) ? sale.transactionsOpeningDay : (sale.transactionsOpeningDay.trim() === '' ? '0' : 'NaN')
    const transactionTotal = isNumber(sale.transactionTotal) ? sale.transactionTotal : (sale.transactionTotal.trim() === '' ? '0' : 'NaN')

    const totalTrueLegacyFee = parseFloat(sale.minimumActual) + parseFloat(sale.commissionRate)
    const netShareToClient = parseFloat(sale.grossSalesActualClover) - totalTrueLegacyFee
    const grossSalesEntireSale = parseFloat(sale.grossSalesCreditDebit || sale.grossSalesCash)

    return {
        ...sale,
        transactions8To10,
        transactionsOpeningDay,
        transactionTotal,

        saleId: sale._id,
        clientEmail: sale.clientEmail.toLowerCase(),
        MailingAddress: ["clientMailingAddress1", "clientMailingAddress2", "clientMailingCity"
            , "clientMailingState", "clientPostalCode"].reduce((acc, cur) => sale[cur] && sale[cur] !== '0' ? `${acc}, ${sale[cur]}` : acc, '')
            .substring(1).trim(),
        grossProceeds: toCurrency(sale.grossSalesActualClover),
        trueLegacyFeeMinimum: toCurrency(sale.minimumActual),
        trueLegacyFee: toCurrency(sale.commissionRate),
        totalTrueLegacyFee: toCurrency(`${totalTrueLegacyFee}`),
        netShareToClient: toCurrency(`${netShareToClient}`),
        disposal: toCurrency(sale.disposalFee),
        totalAmountDue: toCurrency(`${netShareToClient - parseFloat(sale.disposalFee)}`),

        grossSales8To10: toCurrency(sale.grossSales8To10),
        avePurchaseAmount8To10: toCurrency(`${parseFloat(sale.grossSales8To10) / parseInt(transactions8To10)}`),

        grossSalesOpeningDay: toCurrency(sale.grossSalesOpeningDay),
        avePurchaseAmountOpeningDay: toCurrency(`${parseFloat(sale.grossSalesOpeningDay) / parseInt(transactionsOpeningDay)}`),

        grossSalesEntireSale: toCurrency(`${grossSalesEntireSale}`),
        avePurchaseAmountEntireSale: toCurrency(`${grossSalesEntireSale / parseInt(transactionTotal)}`),
    }
}