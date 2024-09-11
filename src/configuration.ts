export const ADConfig = {
  msalConfig: {
    auth: {
      clientId: '13e784b3-3c9a-40b5-9961-84845385735c',
      authority:
        'https://login.microsoftonline.com/301b46be-6483-44f4-8b72-75e684916ddf',
    },
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
  googleConfig:{
    clientId: '1037676707234-djnqlpqerr92hss4b9m1hsefhacq7hgm.apps.googleusercontent.com',
  }
};
