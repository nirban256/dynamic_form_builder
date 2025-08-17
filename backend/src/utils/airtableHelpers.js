import crypto from "crypto";

const base64URLEncode = (str) => {
    return str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

const sha256 = (buffer) => {
    return crypto.createHash("sha256").update(buffer).digest();
}

const generate = () => {
    const code_verifier = base64URLEncode(crypto.randomBytes(32));
    const code_challenge = base64URLEncode(sha256(code_verifier));
    return { code_verifier, code_challenge };
}

const generateState = () => {
    const randomBytes = crypto.randomBytes(32).toString("base64url");
    return randomBytes.slice(0, 32);
}

export { generateState, generate };