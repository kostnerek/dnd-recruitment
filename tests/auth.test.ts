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

const missingEmailUser = {
    password: "zaq",
};
const missingPasswordUser = {
    email: "test@test.com",
}

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
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("User created");
                    res.should.have.status(201);
                    done();
                });
        });
        
        it("should not register a new user with existing email", (done) => {
            server
                .post("/auth/register")
                .send(validUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("User already exists");
                    res.should.have.status(400);
                    done();
                });
        });

        it("should not register a new user with invalid email", (done) => {
            server
                .post("/auth/register")
                .send(invalidMailUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Email is not valid");
                    res.should.have.status(400);
                    done();
                });
        });

        it("should not register a new user with invalid password", (done) => {
            server
                .post("/auth/register")
                .send(invalidPasswordUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Password needs to be between 8-32 characters, have one lower and uppercase and one special character");
                    res.should.have.status(400);
                    done();
                });
        });

        it("should not register a new user with missing email", (done) => {
            server
                .post("/auth/register")
                .send(missingEmailUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Missing username, password or email");
                    res.should.have.status(400);
                    done();
                });
        });

        it("should not register a new user with missing password", (done) => {
            server
                .post("/auth/register")
                .send(missingPasswordUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Missing username, password or email");
                    res.should.have.status(400);
                    done();
                });
        });

        it("should not register a new user with missing email and password", (done) => {
            server
                .post("/auth/register")
                .send({})
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Missing username, password or email");
                    res.should.have.status(400);
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
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Logged in");
                    res.body.should.have.property("tokens");
                    res.should.have.status(200);
                    done();
                });
        });

        it("should not login a user with invalid email", (done) => {
            server
                .post("/auth/login")
                .send(invalidMailUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("User not found");
                    res.should.have.status(404);
                    done();
                });
        });

        it("should not login a valid user with invalid password", (done) => {
            server
                .post("/auth/login")
                .send(invalidPasswordUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Wrong password");
                    res.should.have.status(401);
                    done();
                });
        });

        it("should not login a user with missing email", (done) => {
            server
                .post("/auth/login")
                .send(missingEmailUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("No username/email or password provided");
                    done();
                    res.should.have.status(400);
                });
        });

        it("should not login a user with missing password", (done) => {
            server
                .post("/auth/login")
                .send(missingPasswordUser)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("No username/email or password provided");
                    res.should.have.status(400);
                    done();
                });
        });

        it("should not login a user with missing email and password", (done) => {
            server
                .post("/auth/login")
                .send({})
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("No username/email or password provided");
                    res.should.have.status(400);
                    done();
                });
        });

    });

    describe("POST /auth/refresh", () => {
        let tokens: any;
        before((done)=>{
            server
                .post("/auth/login")
                .send(validUser)
                .end((err, res) => {
                    tokens = res.body.tokens;
                    done();
                })
        })

        it("should refresh a token", (done) => {
            server
                .post("/auth/refresh")
                .set("Authorization", `Bearer: ${tokens.refreshToken}`)
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.should.have.property("accessToken");
                    res.body.should.have.property("refreshToken");
                    res.should.have.status(200);
                    done();
                });
        });

        it("should not refresh a token with invalid token", (done) => {
            server
                .post("/auth/refresh")
                .set("Authorization", `Bearer: 213${tokens.refreshToken}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message")
                    .eq("Invalid token");
                    done();
                });
        });
    });

});
