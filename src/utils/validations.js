const hasParams = (params) =>
  Object.values(params).some((value) => value.trim() !== "");

module.exports = {
  hasParams,
};
