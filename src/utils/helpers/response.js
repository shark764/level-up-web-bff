const success = (args) => ({
  status: 'success',
  requestId: args.requestId,
  data: args.data || { message: 'Operation was successful.' },
});

const error = (args) => {
  const { code } = args;
  let message = args.message || 'Server Error';
  switch (code) {
    case 400:
      message = 'LUL-WEB000 - Bad request check body/params';
      break;

    case 401:
      message = 'LUL-WEB001 - Authentication required';
      break;

    case 402:
      message = 'LUL-WEB002 - Payment required';
      break;

    case 403:
      message = 'LUL-WEB003 - Forbidden Action';
      break;

    case 404:
      message = 'LUL-WEB004 - Not found';
      break;

    case 406:
      message = 'LUL-WEB006 - Login required';
      break;

    case 409:
      message = 'LUL-WEB009 - Resource is already in use';
      break;

    case 422:
      message = 'LUL-WEB022 - Request Failed For Model';
      break;
  }
  return {
    status: 'error',
    requestId: args.requestId,
    error: {
      code: args.code,
      message: args.message || message,
    },
  };
};

module.exports = { success, error };
