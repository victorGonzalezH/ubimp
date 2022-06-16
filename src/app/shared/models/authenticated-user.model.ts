export interface AuthenticatedUser {

    username: string;

    token: string;

    refreshToken: string;

    roles: string[];
}
