interface Schema {
    // Define the properties of the schema object based on Okta's schema definition
    // Example properties, add more as needed
    properties: {
      [key: string]: any;
    };
  }
  
  interface PostData {
    [key: string]: any;
  }
  
  interface Response {
    oktaStatus: string;
    session: {
      setCookieAndRedirect: (url: string) => void;
    };
  }
  
  interface OktaConfig {
    
    clientId: string;
    redirectUri: string;
    
      issuer: string;
      
      scopes: string[];
      pkce: boolean;
      disableHttpsCheck: boolean;
      useClassicEngine: boolean;
    features: {
      registration: boolean;
    };
    registration: {
      parseSchema: (
        schema: Schema,
        onSuccess: (schema: Schema) => void,
        onFailure: (error: Error) => void
      ) => void;
      preSubmit: (
        postData: PostData,
        onSuccess: (postData: PostData) => void,
        onFailure: (error: Error) => void
      ) => void;
      postSubmit: (
        response: Response,
        onSuccess: (response: Response) => void,
        onFailure: (error: Error) => void
      ) => void;
    };
  }
  export default OktaConfig;