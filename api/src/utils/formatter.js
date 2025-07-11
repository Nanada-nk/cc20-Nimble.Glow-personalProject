
export function formatDates(data) {
  const dateFields = [
    'createdAt', 'updatedAt', 'lastLogin', 'expiredAt',
    'shippedAt', 'deliveredAt', 'reviewDate', 'usedAt'
  ];

  const formatSingleObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const formattedObj = { ...obj };
    for (const field of dateFields) {
      if (formattedObj[field] && typeof formattedObj[field] !== 'string') {
        formattedObj[field] = new Date(formattedObj[field]).toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' });
      }
    }

    for (const key in formattedObj) {
      if (typeof formattedObj[key] === 'object') {
        formattedObj[key] = formatDates(formattedObj[key]);
      }
    }
    return formattedObj;
  };

  if (Array.isArray(data)) {
    return data.map(formatSingleObject);
  } else {
    return formatSingleObject(data);
  }
}