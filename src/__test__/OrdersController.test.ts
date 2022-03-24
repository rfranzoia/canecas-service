import supertest from "supertest";
import {TestHelper} from "./TestHelper";
import app from "../api/api";
import {StatusCodes} from "http-status-codes";
import {OrderDTO} from "../controller/Orders/OrderDTO";
import {UserDTO} from "../controller/Users/UserDTO";

describe("Orders API test (requires jwt token)", () => {

    beforeAll(async () => {
        await TestHelper.createLoginTestUser();
    });

    afterAll(async () => {
        await TestHelper.deleteLoginTestUser();
    });

    describe("given a list of order exists in the database", () => {
        let orders: OrderDTO[];

        it("should be able to list all orders", async () => {
            const response = await supertest(app)
                .get("/api/orders")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
            orders = [...response.body.data];
        });

        it("should be able to list all orders by a date range", async () => {
            const startDate = new Date(2022, 0, 1).toISOString().split("T")[0];
            const endDate = new Date(2022, 11, 31).toISOString().split("T")[0];
            const response = await supertest(app)
                .get(`/api/orders/from/${startDate}/to/${endDate}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it("should be able to retrieve an order by its ID", async () => {
            const orderId = orders[0].id;
            const response = await supertest(app)
                .get(`/api/orders/${orderId}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.id).toEqual(orderId);
        });
    });

    describe("given a customer order doesn't exists in the database", () => {
        let order: OrderDTO;
        let createdUser: UserDTO;

        it("should be able to create a new order", async () => {

            // creates a new user to use as customer
            let response = await supertest(app)
                .post("/api/users")
                .send(TestHelper.getTestUser());
            createdUser = response.body.data;

            const CUSTOMER_ORDER = {
                user_id: createdUser.id,
                orderItems: [
                    {
                        product_id: 5,
                        quantity: 2,
                        price: 100,
                        discount: 0
                    },
                    {
                        product_id: 3,
                        quantity: 1,
                        price: 50,
                        discount: 0
                    },
                    {
                        product_id: 6,
                        quantity: 1,
                        price: 50,
                        discount: 0
                    }
                ]
            };

            // attempts to create the order
            response = await supertest(app)
                .post("/api/orders")
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken)
                .send(CUSTOMER_ORDER);
            expect(response.statusCode).toBe(StatusCodes.CREATED);
            order = response.body.data;

        });


        it("and should be able to delete the recently created order", async () => {
            let response = await supertest(app)
                .delete(`/api/orders/${order.id}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

            // finally deletes the created user/customer
            await supertest(app)
                .delete(`/api/users/${createdUser.id}`)
                .set("Authorization", "Bearer " + TestHelper.getLoginTestUser().authToken);
        });


    });


});