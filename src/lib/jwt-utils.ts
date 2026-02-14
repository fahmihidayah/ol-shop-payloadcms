import { decodeJwt } from "jose";

export interface DecodedUserToken {
    id: string;
    collection: string;
    email: string | null;
    sid: string;
    iat: number;
    exp: number;
}

/**
 * Decodes a JWT token and returns the full payload if valid and not expired.
 * @param token - The JWT token string.
 * @returns The decoded user token if valid, or null if invalid/expired.
 */
export const getUserFromToken = async (token: string): Promise<DecodedUserToken | null> => {
    try {
        const decoded = decodeJwt(token) as DecodedUserToken;
        console.log("Decoded JWT:", decoded);

        const nowInSeconds = Math.floor(Date.now() / 1000);

        if (!decoded.exp || decoded.exp < nowInSeconds) {
            console.warn("JWT token has expired or missing expiration field.");
            return null;
        }

        if (!decoded.id) {
            console.warn("Decoded JWT missing user ID.");
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};