export const validateEmployee = (form) => {
  const errors = {};
  if (!form.name?.trim()) errors.name = "Name is required";
  if (!form.email?.trim()) errors.email = "Email is required";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email";
  }
  if (!form.departmentId) errors.departmentId = "Department is required";
  if (!form.position) errors.position = "Position is required";
  return errors;
};
