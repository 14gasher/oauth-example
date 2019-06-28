```
  ___    _         _   _       ____    ___  
 / _ \  / \  _   _| |_| |__   |___ \  / _ \
| | | |/ _ \| | | | __| '_ \    __) || | | |
| |_| / ___ \ |_| | |_| | | |  / __/ | |_| |
 \___/_/   \_\__,_|\__|_| |_| |_____(_)___/

 _____                           _      
| ____|_  ____ _ _ __ ___  _ __ | | ___
|  _| \ \/ / _` | '_ ` _ \| '_ \| |/ _ \
| |___ >  < (_| | | | | | | |_) | |  __/
|_____/_/\_\__,_|_| |_| |_| .__/|_|\___|
                          |_|           
```

# Table of Contents

1. [Installation and Setup](#install)
1. [Important Links](#links)
1. [Flow](#flow)
    - [0. Overview](#flow-overview)
    - [1. Authorization](#flow-authorization)
    - [2. Token](#flow-token)
    - [3. Authentication](#flow-authentication)

<a id='install'></a>
# Installation and Setup

1. Clone this Repo
1. `cd` into the project root folder, and run `yarn`
  - If `yarn` is not installed, install it and then run `yarn`
1. Run `yarn authServer` to boot up the oauth 2.0 server
1. Run `yarn devAuth` to boot up the oauth 2.0 server in dev mode. This will enable hot reloading when your code changes.

<a id='links'></a>
# Important Links
Checkout
[Oauth-server-github](https://github.com/oauthjs/node-oauth2-server)
if you are running into any weird errors. Tutorials are seriously lacking
on this implementation of the Oauth2.0 protocol as most people use
an external service for it. Luckily, the errors are pretty specific,
so you can go through their code to figure out what is happening.

Also, if you want to see how the middleware is generated, checkout
[this](https://github.com/oauthjs/express-oauth-server)
to see the middleware stuff. Their examples are out of date, so
ignore them.

<a id='flow'></a>
# Flow
Alright, this is where we will write a more comprehensive tutorial
on how to do authorization grant styled oauth 2 than I was able to
find. First, we will cover an overview of what the protocol says,
then dive into detail with each of the sections.

<a id='flow-overview'></a>
### 0. Overview
First, some definitions and reminders:
- *Client*: The application wanting to have access to your resources
- *User*: The person wanting to use your resources on the Client
- *Authorization*: The process of determining whether something has access to protected resources
- *Authentication*: The process of determining a person's identity.
- *OAuth2.0*: A protocol outlining how authorization should happen. It is NOT an authentication library. You will need to provide that yourself.

Aight, with those out of the way, we need to cover the basic flow with the authorization code grant.

1. Authorization
    - Client application contacts the Server and requests access
    - Client application provides a client_id (unique string identifier)
    - Client provides a redirect uri to send the user after the code is delivered
    - Client may provide user data for authentication purposes
    - Server validates information and sends back an authorization code
2. Token
    - Client uses received authorization code to request a token
    - Client sends client_id, client_secret (if applicable)
    - Server validates request, and sends a token.
3. Authentication
    - Client uses token to gain access to Server's protected resources

In the OAuth2.0 library, each of the above areas are handled within
dedicated urls. Specific details on how to handle the different things
are added to the `model` object within the OAuth server.

Now, we will explore each of the above 3 areas in depth.

<a id='flow-authorization'></a>
### 1. Authorization

After hitting the Authorization url, the following calls are made within
the model object in this order:

1. `getClient`: This will extract the `client_id` from the request's query or body parameter. You can then go through and verify that the client is indeed a good client, what redirects are permitted for the Client, and what grants they have access to (in this example, just 'authorization_code'). Upon verification, return a valid Client object.
    - After calling `getClient`, if you passed an `authenticateHandler` to the `authorize` method call, this will then be called. If you return some non-falsy object, that object will be the User and will assume the User was able to authenticate. If you return a falsy object, we will assume that the user failed to authenticate, and must be booted. So, in short, this is where you authenticate the user.
1. `saveAuthorizationCode`: This will give you an authorization code, the retrieved Client Object from `getClient`, and the user from the `authenticateHandler`. This information needs to be stored in your database. Once stored, return the information

After making the above calls, the server redirects you to the provided `redirect_uri` with the authorization code present as a url query parameter.

<a id='flow-token'></a>
### 2. Token

After hitting the token url, the following calls are made within the model object in this order:

1. `getClient`: Same as before, but will now allow you set the `client_secret` to ensure the client is a valid client.
1. `getAuthorizationCode`: using the `authorizationCode` the client provides, look up in the database for the client, user, and code information for that code, and return it. If none, return false to stop the request as it is invalid.
1. `revokeAuthorizationCode`: using the `authorizationCode` the client provides, delete from the database where the code exists. Return true if the code was deleted, false otherwise. Each authorization code can only be used once.
1. `generateAccessToken (optional)`: using the client and user provided, generate an access token. If not provided, the library will use its in-built library to generate a token. If you want to use JWTs, this is where that would happen.
1. `saveToken`: using the client, code, and token generated earlier, save this information in the database.

The token is then sent as a json response like this:
```js
{
  access_token: "38a72b9262f931a74377dc4f8c0d1d906a89af35",
  token_type: "Bearer",
  expires_in: 86399
}
```

<a id='flow-authentication'></a>
### 3. Authentication

Use the token type and token code to add an authorization header like this: `${token_type $token_code}`. This will allow the token to be transmitted securely.

After hitting an authenticate url, the following calls are made within the model object in this order:

1. `getAccessToken`: using the token code provided by the client, return the token, client, and user associated with the token code. If not valid, return false. If you want to access this information in your routes, it is found in `res.locals.oauth.token`, so you immediately have access to the client and user information associated with the token.
