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
  - [Overview](#flow-overview)

<a id='install'></a>
# Installation and Setup

1. Clone this Repo
1. `cd` into the project root folder, and run `yarn`
  - If `yarn` is not installed, install it and then run `yarn`
1. Run `yarn test` to run unit tests
1. Run `yarn authServer` to boot up the oauth 2.0 server
1. Run `yarn webServer` to boot up the test web server

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
### Overview
First, some definitions:
- *Client*: The application wanting to have access to your resources
- *User*: The person wanting to use your resources on the Client
- *Authorization*: The process of determining whether something has access to protected resources
- *Authentication*: The process of determining a person's identity.
- *OAuth2.0*:
