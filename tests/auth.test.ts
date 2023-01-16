import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";
import prisma from "../src/prismaConnect";

chai.use(chaiHttp);
chai.should();
const server = chai.request(app).keepOpen();
const validUser = {
    email: "test@test.com",
    password: "zaq1@WSX",
};
const invalidMailUser = {
    email: "123",
    password: "zaq1@WSX",
};
const invalidPasswordUser = {
    email: "test@test.com",
    password: "zaq1",
};
describe("Auth", () => {
    after(async () => {
        await prisma.user.delete({
            where: {
                email: validUser.email,
            },
        });
        server.close();
    });

    describe("POST /auth/register", () => {
        it("should register a new user", (done) => {
            console.log("test");
            server
                .post("/auth/register")
                .send(validUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("User created");
                    done();
                });
        });
        
        it("should not register a new user with existing email", (done) => {
            server
                .post("/auth/register")
                .send(validUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("User already exists");
                    done();
                });
        });

        it("should not register a new user with invalid email", (done) => {
            server
                .post("/auth/register")
                .send(invalidMailUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Email is not valid");
                    done();
                });
        });

        it("should not register a new user with invalid password", (done) => {
            server
                .post("/auth/register")
                .send(invalidPasswordUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Password needs to be between 8-32 characters, have one lower and uppercase and one special character");
                    done();
                });
        });
    });

    describe("POST /auth/login", () => {
        it("should login a user",  (done) => {
            server
                .post("/auth/login")
                .send(validUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Logged in");
                    res.body.should.have.property("tokens");
                    done();
                });
        });

        it("should not login a user with invalid email", (done) => {
            server
                .post("/auth/login")
                .send(invalidMailUser)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("User not found");
                    done();
                });
        });

        it("should not login a valid user with invalid password", (done) => {
            server
                .post("/auth/login")
                .send(invalidPasswordUser)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Wrong password");
                    done();
                });
        });
    });
});
