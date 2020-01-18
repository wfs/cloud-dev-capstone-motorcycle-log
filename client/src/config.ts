// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'nyxzfq97mk'
export const apiEndpoint = `https://${apiId}.execute-api.ap-southeast-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'test-endpoint.au.auth0.com', // Auth0 domain
  clientId: 'z646LnfKNVa2ijUWOIOmcTb5Fu0tyz5L', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
