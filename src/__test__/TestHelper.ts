import {UsersService} from "../service/Users/UsersService";
import randomEmail from "random-email";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import logger from "../utils/Logger";
import {UserDTO} from "../controller/Users/UserDTO";

export const LOGIN_USER: TestUser = {
    role: "ADMIN",
    name: "Login Admin User Test",
    email: "loginadminusertest@me.com",
    password: "somepassword",
    phone: "+999 12346344",
    address: "Somewhere/Earth"
}

export const TEST_USER: TestUser = {
    role: "USER",
    name: "Created Test User",
    email: "created.test.user@me.com",
    password: "fakepassword",
    phone: "+999 12344",
    address: "Somewhere/Earth"
}


export interface TestUser {
    id?: number;
    role: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    authToken?: string;
}

export const TestHelper = {

    async createLoginUserAndAuthenticate(role: string): Promise<UserDTO> {
        // create a test user and login to get access token
        const user = {
            ...LOGIN_USER,
            role: role,
            email: randomEmail(),
        }

        await new UsersService().create(user);
        const response = await new UsersService().authenticate(user.email, user.password);
        if (response instanceof UnauthorizedError) {
            logger.error("User not authorized to login with the provided credentials", response);
        }
        return response as UserDTO;
    },

    async deleteLoginTestUser(userId: number) {
        // delete test user
        await new UsersService().delete(userId);
    },

    getTestUser(): TestUser {
        return {
            ...TEST_USER,
            email: randomEmail()
        };
    }
}