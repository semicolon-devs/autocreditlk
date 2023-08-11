function amountToPay(loanAmount, installmentAmount, paidAmount, noOfCyclesBehind) {
    noOfCyclesBehind++;
  
    const amountLeft = loanAmount - paidAmount;
    const arrears = installmentAmount * noOfCyclesBehind;
  
    let toPay = (amountLeft >= arrears ? arrears : amountLeft);
  
    return toPay;
  }


module.exports = {
    amountToPay
  }