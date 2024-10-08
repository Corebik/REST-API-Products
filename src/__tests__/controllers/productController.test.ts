import request from "supertest";
import server from "../../server.ts";

describe("POST /api/products", () => {

   it("Should display validation errors", async() => {
      const response = await request(server).post("/api/products").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toBeInstanceOf(Array);

      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(201);
   });

   it("Should validate the price is greater than 0", async() => {
      const response = await request(server).post("/api/products").send({
         name: "Test Product",
         price: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(1);

      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(201);
   });

   it("Should validate the price is a number and greater than 0", async() => {
      const response = await request(server).post("/api/products").send({
         name: "Test Product",
         price: "test",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(2);

      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(201);
   });

   it("Should create a new product", async() => {
      const response = await request(server).post("/api/products").send({
         name: "Test Product",
         price: 100,
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("productAdded");

      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(400);
      expect(response.body).not.toHaveProperty("errors");
   });

});

describe("GET /api/products", () => {

   it("Should check if api/products url exists", async() => {
      const response = await request(server).get("/api/products");
      expect(response.status).not.toBe(404);
   });

   it("GET a JSON response with products", async() => {
      const response = await request(server).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);

      expect(response.status).not.toBe(404);
      expect(response.headers['content-type']).not.toMatch(/html/);
      expect(response.body).not.toHaveProperty("errors");
   });

});

describe("GET /api/products/:id", () => {

   it("Should return a 404 response for a non-existent product", async() => {
      const productId = 9999;
      const response = await request(server).get(`/api/products/${productId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
   });

   it("should check a valid ID in the URL", async() => {

      const response = await request(server).get("/api/products/not-valid-url");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("Not a valid ID");

   });

   it("Get a JSON response for a single product", async() => {

      const productId = 1;
      const response = await request(server).get(`/api/products/${productId}`);

      expect(response.status).toBe(200);
   });

});

describe("PUT /api/products/:id", () => {

   it("Should check a valid ID in the URL", async() => {
      const response = await request(server)
                              .put("/api/products/not-valid-url")
                              .send({
                                 name: "Test Product",
                                 price: 100,
                                 availability: true
                              });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("Not a valid ID");
   });

   it("Should display validation error messages when updating a product", async() => {
      const response = await request(server)
                              .put("/api/products/1")
                              .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors).toHaveLength(5);

      expect(response.status).not.toBe(200);
      expect(response.body).not.toHaveProperty("productUpdated");
   });

   it("Should validate that the price is greater than 0", async() => {
      const response = await request(server)
                              .put("/api/products/1")
                              .send({
                                 name: "Test Product",
                                 price: 0,
                                 availability: true
                              });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("Price must be greater than 0");

      expect(response.status).not.toBe(200);
      expect(response.body).not.toHaveProperty("productUpdated");
   });

   it("Should return a 404 response for a non-existent product", async() => {
      const productId = 9999;
      const response = await request(server)
                              .put(`/api/products/${productId}`)
                              .send({
                                 name: "Test Product",
                                 price: 100,
                                 availability: true
                              });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");

      expect(response.status).not.toBe(200);
      expect(response.body).not.toHaveProperty("productUpdated");
   });

   it("Should update an existing product with valid data", async() => {
      const productId = 1;
      const response = await request(server)
                              .put(`/api/products/${productId}`)
                              .send({
                                 name: "Test Product",
                                 price: 100,
                                 availability: true
                              });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("product");

      expect(response.status).not.toBe(404);
   });
   
});

describe("PATH /api/products/:id", () => {

   it("Should return a 404 response for a non-existent product", async() => {
      const productId = 9999;
      const response = await request(server)
                              .patch(`/api/products/${productId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");

      expect(response.status).not.toBe(200);
      expect(response.body).not.toHaveProperty("product");
   });

   it("Should update an existing product", async() => {
      const productId = 1;
      const response = await request(server)
                              .patch(`/api/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");

      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(400);
      expect(response.body).not.toHaveProperty("errors");
   });

});

describe("DELETE /api/products/:id", () => {

   it("Should check a valid ID in the URL", async() => {
      const response = await request(server)
                              .delete("/api/products/not-valid-url")
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].msg).toBe("Not a valid ID");
   });

   it("Should return a 404 response for a non-existent product", async() => {
      const productId = 9999;
      const response = await request(server)
                              .delete(`/api/products/${productId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");

      expect(response.status).not.toBe(200);
      expect(response.body).not.toHaveProperty("productDeleted");
   });

   it("Should delete a product", async() => {
      const productId = 1;
      const response = await request(server)
                              .delete(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Product deleted successfully");

      expect(response.status).not.toBe(404);
   });

});

describe("Product for test errros", () => {
   it("Should create a new product", async() => {
      const response = await request(server).post("/api/products").send({
         name: "Test Product",
         price: 100,
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("productAdded");

      expect(response.status).not.toBe(404);
      expect(response.status).not.toBe(400);
      expect(response.body).not.toHaveProperty("errors");
   });
});