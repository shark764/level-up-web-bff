export const success = (args) => ({
  status: 'success',
  requestId: args.requestId,
  data: args.data || 'Operation successful',
});

export const error = (args) => ({
  status: 'error',
  requestId: args.requestId,
  error: {
    code: args.code,
    message: args.message || 'Server Error',
  },
});
