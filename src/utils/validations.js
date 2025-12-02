const hasParams = (params) => {
  return Object.values(params).some((value) => value.trim() !== "");
};

module.exports = {
  hasParams,
};
