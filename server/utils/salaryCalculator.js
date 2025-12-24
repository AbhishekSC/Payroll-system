export const calculateNetSalary = (p) => {
  const gross = p.salary + p.bonus;
  const tax = (gross * p.taxPercent) / 100;
  const ss = (gross * p.socialSecurityPercent) / 100;
  const net = gross - tax - ss - p.deductions;

  return {
    gross: round(gross),
    tax: round(tax),
    socialSecurity: round(ss),
    net: round(net),
  };
};

const round = (v) => Math.round(v * 100) / 100;
