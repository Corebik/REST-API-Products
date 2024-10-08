import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProductPut } from "./controllers/productController.js";

import { body, param } from "express-validator";
import { handleInputErrors } from "./middlewares/handleInputErrors.js";

const router = Router();

/** 
* @swagger
* components:
*   schemas:
*       Product:
*           type: object
*           properties:
*               id:
*                   type: integer
*                   description: The product ID
*                   example: 1
*               name:
*                   type: string
*                   description: The Product name
*                   example: "Monitor de 49 pulgadas"
*               price:
*                   type: number
*                   description: The Product price
*                   example: 100
*               availability:
*                   type: boolean
*                   description: The Product availability
*                   example: true
*/

/**
 * @swagger
 * /api/products:
 *   get:
 *       summary: Get a list of products
 *       tags: [Products]
 *       description: Return a list of products
 *       responses:
 *          200:
 *              description: Sucessful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 *          500:
 *              description: Internal server error
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *       summary: Get a product by ID
 *       tags: [Products]
 *       description: Return a product based on its unique ID
 *       parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *       responses:
 *          200:
 *              description: Sucessful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product not found
 *          400:
 *              description: Bad request - Invalid ID
 *          500:
 *              description: Internal server error
 */
router.get("/:id", 
   //!Middlewares
   param("id").isInt().withMessage("Not a valid ID"),
   handleInputErrors,
   //!Controller
   getProductById
);

/**
 * @swagger
 * /api/products:
 *   post:
 *       summary: Creates a new product
 *       tags: [Products]
 *       description: Returns a new record in the database
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         name:
 *                            type: string
 *                            example: "Monitor de 49 pulgadas"
 *                         price:
 *                            type: number
 *                            example: 100
 *       responses:
 *          201:
 *              description: Product created successfully
 *          400:
 *              description: Bad request - Invalid input data
 */
router.post("/", 
   //!Middlewares
   body("name").notEmpty().withMessage("Name is required"),
   body("price")
   .custom(value => value > 0).withMessage("Price must be greater than 0")
   .notEmpty().withMessage("Price is required")
   .isNumeric().withMessage("Price must be a number"),
   handleInputErrors,
   //!Controller
   createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *       summary: Updates a product with user input
 *       tags: [Products]
 *       description: Returns the updated product
 *       parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to update
 *          required: true
 *          schema:
 *              type: integer
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 100
 *                          availability:
 *                              type: boolean
 *                              example: true
 *       responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid input data
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */
router.put("/:id", 
   //!Middlewares
   param("id").isInt().withMessage("Not a valid ID"),
   body("name").notEmpty().withMessage("Name is required"),
   body("price")
      .custom(value => value > 0).withMessage("Price must be greater than 0")
      .notEmpty().withMessage("Price is required")
      .isNumeric().withMessage("Price must be a number"),
   body("availability").isBoolean().withMessage("Availability must be a boolean"),
   handleInputErrors,
   //!Controller
   updateProductPut
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *       summary: Updates a product availability
 *       tags: [Products]
 *       description: Returns the updated product
 *       parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *       responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid input data
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */
router.patch("/:id", 
   //!Middlewares
   param("id").isInt().withMessage("Not a valid ID"),
   handleInputErrors,
   //!Controller
   updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *       summary: Deletes a product
 *       tags: [Products]
 *       description: Returns the deleted product
 *       parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *       responses:
 *          200:
 *              description: Product deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "Product deleted successfully"
 *          400:
 *              description: Bad request - Invalid input data
 *          404:
 *              description: Product not found
 */
router.delete("/:id", 
   //!Middlewares
   param("id").isInt().withMessage("Not a valid ID"),
   handleInputErrors,
   //!Controller
   deleteProduct
);

export default router;