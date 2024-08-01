import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
    config: {
        host: 'api.mailjet.com',
        version: 'v3',
        output: 'text',
    }
    });
  
