import { Auth0Client } from "@auth0/nextjs-auth0/server";

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const secret = process.env.AUTH0_SECRET;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const clientAssertionSigningKey = process.env.AUTH0_CLIENT_ASSERTION_SIGNING_KEY;

const hasAuth0Config = Boolean(
	domain &&
		clientId &&
		secret &&
		(clientSecret || clientAssertionSigningKey),
);

export const auth0 = hasAuth0Config
	? new Auth0Client({
			domain: domain!,
			clientId: clientId!,
			secret: secret!,
			...(clientSecret ? { clientSecret } : { clientAssertionSigningKey }),
		})
	: null;