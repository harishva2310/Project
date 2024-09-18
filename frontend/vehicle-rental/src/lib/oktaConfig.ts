import OktaConfig from "./oktaInterface";
const oktaConfig : OktaConfig ={
    clientId: `0oahrszeybHhLlisT5d7`,
    issuer: `https://dev-02389618.okta.com/oauth2/default`,
    redirectUri: `https://vehicle-rental-production.up.railway.app/login/callback`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    useClassicEngine: true,
    features: {
        registration: true, // Enable self-service registration feature
    },
    registration: {
        // Additional registration settings
        parseSchema: function (schema, onSuccess, onFailure) {
            // handle parsing schema
            onSuccess(schema);
        },
        preSubmit: function (postData, onSuccess, onFailure) {
            // handle pre-submit actions
            onSuccess(postData);
        },
        postSubmit: function (response, onSuccess, onFailure) {
            // handle post-submit actions
            onSuccess(response);
        },
    },
    
    
}

export default oktaConfig;