import { Request, Response } from "express";
import Product from "../models/Product.model.js";
// import { validationResult } from "express-validator";

export const createProduct = async( req : Request, res : Response ) => {
   try {
      const productAdded = await Product.create(req.body);
      res.status(201).json({ message: "Product created successfully", productAdded });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const getProducts = async( req : Request, res : Response ) => {
   try {
      const products = await Product.findAll({
         order: [["price", "DESC"]],
         limit: 4,
         attributes: ["id", "name", "price", "availability"],
         where: { availability: true }
      });
      res.status(200).json({ products });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}; 

export const getProductById = async( req : Request, res : Response ) => {
   try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if( !product ) {
         res.status(404).json({ message: "Product not found" });
         return;
      }

      res.status(200).json({ product });
      
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const updateProductPut = async( req : Request, res : Response ) => {
   try {

      const { id } = req.params;
      const product = await Product.findByPk(id);

      if( !product ) {
         res.status(404).json({ message: "Product not found" });
         return;
      }
      await product.update(req.body);
      await product.save();
      res.status(200).json({ message: "Product updated successfully", product });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}; 

export const updateAvailability = async( req : Request, res : Response ) => {
   try {
      const { id } = req.params;
      const { availability } = req.body;
      const product = await Product.findByPk(id);
      if( !product ) {
         res.status(404).json({ message: "Product not found" });
         return;
      }

      product.availability = !product.dataValues.availability;
      await product.save();
      res.status(200).json({ message: "Product updated successfully", product });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export const deleteProduct = async( req : Request, res : Response ) => {
   try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if( !product ) {
         res.status(404).json({ message: "Product not found" });
         return;
      }
      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};