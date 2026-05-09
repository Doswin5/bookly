export const validateDateRange = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return {
      isValid: false,
      message: "Invalid date format."
    };
  }

  if (start <= now) {
    return {
      isValid: false,
      message: "Slot start time must be in the future."
    };
  }

  if (end <= start) {
    return {
      isValid: false,
      message: "End time must be after start time."
    };
  }

  return {
    isValid: true,
    start,
    end
  };
};