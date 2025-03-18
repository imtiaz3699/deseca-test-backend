export const apiErrorHandler = async (
  res,
  status = 400,
  message = "Server Error"
) => {
  return res.status(status).json({ message });
};

export const apiSuccessResponse = async (
  res,
  message = "Server error.",
  data
) => {
  return res.status(200).json({ message: message, data: data });
};
