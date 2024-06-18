const oktaConfig = {
    clientId: `0oahrszeybHhLlisT5d7`,
    issuer: `https://dev-02389618.okta.com/oauth2/default`,
    redirectUri: `http://localhost:3000/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    useClassicEngine: true
}

export default oktaConfig;