/**
 * Utility functions for formatting and validation
 */

export const formatCurrency = (value) => {
  return parseFloat(value || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatNumber = (value) => {
  return parseFloat(value || 0).toLocaleString('th-TH');
};

export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const convertToThaiYear = (year) => {
  return year + 543;
};

export const convertFromThaiYear = (thaiYear) => {
  return thaiYear - 543;
};

export const getMonthName = (monthKey) => {
  const months = {
    'oct': 'ต.ค.',
    'nov': 'พ.ย.',
    'dec': 'ธ.ค.',
    'jan': 'ม.ค.',
    'feb': 'ก.พ.',
    'mar': 'มี.ค.',
    'apr': 'เม.ย.',
    'may': 'พ.ค.',
    'jun': 'มิ.ย.',
    'jul': 'ก.ค.',
    'aug': 'ส.ค.',
    'sep': 'ก.ย.'
  };
  return months[monthKey] || monthKey;
};

export const getFullMonthName = (monthKey) => {
  const months = {
    'oct': 'ตุลาคม',
    'nov': 'พฤศจิกายน',
    'dec': 'ธันวาคม',
    'jan': 'มกราคม',
    'feb': 'กุมภาพันธ์',
    'mar': 'มีนาคม',
    'apr': 'เมษายน',
    'may': 'พฤษภาคม',
    'jun': 'มิถุนายน',
    'jul': 'กรกฎาคม',
    'aug': 'สิงหาคม',
    'sep': 'กันยายน'
  };
  return months[monthKey] || monthKey;
};

export const calculateTotal = (row, months = []) => {
  let total = 0;
  months.forEach(month => {
    total += parseFloat(row[month]) || 0;
  });
  return total;
};
