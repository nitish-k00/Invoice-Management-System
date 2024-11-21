const total = (details) => {
  console.log(details);
  return details.reduce((sum, value) => {
    const line = value.quantity * value.unit_price;
    return sum + line;
  }, 0);
};

module.exports = { total };
