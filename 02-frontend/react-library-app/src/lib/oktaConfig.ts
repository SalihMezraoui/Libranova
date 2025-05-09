export const oktaConfig = {
    clientId: '0oaonf97oxVITfSAi5d7',
    issuer: 'https://dev-27952537.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'], 
    pkce: true,
    disableHttpsCheck: true,
}