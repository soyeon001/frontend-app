/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    aws_project_region: "ap-northeast-2",
    aws_cognito_region: "ap-northeast-2",
    aws_user_pools_id: "ap-northeast-2_7eNvAjcCC",
    aws_user_pools_web_client_id: "24aivdtpmmjf47lod8ul3tf8fi",
    oauth: {
      domain: "homeow.auth.ap-northeast-2.amazoncognito.com",
      scope: ["email", "openid", "profile", "aws.cognito.signin.user.admin"], // Google 로그인에 필요한 스코프, "aws.cognito.signin.user.admin"
      redirectSignIn: "https://www.homeow.site",
      redirectSignOut: "https://www.homeow.site",
      // redirectSignIn: "http://localhost:3000",
      // redirectSignOut: "http://localhost:3000",
      responseType: "code",
    },
    aws_cognito_username_attributes: ["EMAIL"],
    aws_cognito_social_providers: ["Google"],
    aws_cognito_signup_attributes: ["NAME"],
    aws_cognito_mfa_configuration: "OFF",
    aws_cognito_mfa_types: [],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: [
        "REQUIRES_LOWERCASE",
        "REQUIRES_UPPERCASE",
        "REQUIRES_NUMBERS",
        "REQUIRES_SYMBOLS",
      ],
    },
    aws_cognito_verification_mechanisms: ["EMAIL"],
  };
  
  export default awsmobile;