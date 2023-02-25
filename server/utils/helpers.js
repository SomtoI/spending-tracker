const DAILY = "daily";
const MONTHLY = "monthly";
const YEARLY = "yearly";

const resolveDateRange = (frame, range) => {
  const from = new Date();
  const to = new Date();
  // subtract one from the range as today is included
  range = range - 1;

  switch (frame) {
    case DAILY: {
      from.setDate(from.getDate() - range);
      break;
    }
    case MONTHLY: {
      from.setMonth(from.getMonth() - range);
      from.setDate(1);
      break;
    }
    case YEARLY: {
      from.setFullYear(from.getFullYear() - range);
      from.setMonth(0);
      from.setDate(1);
      break;
    }
    default: {
      break;
    }
  }

  from.setHours(0, 0, 0, 0);

  return { from, to };
};

module.exports = {
  DAILY,
  MONTHLY,
  YEARLY,
  resolveDateRange,
};
