const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const productModel = require("../models/ProductModel");
const { validationResult } = require("express-validator")

class Product {
    async create(req, res) {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (!err) {
                const parsedData = JSON.parse(fields.data);
                const errors = [];

                if (parsedData.title.trim().length === 0) {
                    errors.push({ msg: 'Title is required' })
                }
                if (parseInt(parsedData.price) < 1) {
                    errors.push({ msg: "Price should be above $1" });
                }
                if (parseInt(parsedData.discount) < 0) {
                    errors.push({ msg: "Discount should not be negative" });
                }
                if (parseInt(parsedData.stock) < 20) {
                    errors.push({ msg: "Stock should be above 20" });
                }
                if (fields.description.trim().length === 0) {
                    errors.push({ msg: "Description is required" });
                }
                if (errors.length === 0) {
                    if (!files['image1']) {
                        errors.push({msg: 'image1 is required'});
                    }
                    if (!files['image2']) {
                        errors.push({msg: 'image2 is required'});
                    }
                    if (!files['image3']) {
                        errors.push({msg: 'image3 is required'});
                    }
                    if (errors.length === 0) {
                        const images = {}
                        for(let i = 0; i < Object.keys(files).length; i++){
                            const mimeType = files[`image${i+1}`].mimetype;
                            const extension = mimeType.split('/')[1].toLowerCase();
                            if (extension === 'jpeg' || extension === 'jpg' || extension === 'png') {
                                const imageName = uuidv4() + `.${extension}`;
                                const __dirname = path.resolve();
                                const newPath = __dirname + `/../client/public/images/${imageName}`;
                                images[`image${i+1}`] = imageName 
                                fs.copyFile(files[`image${i+1}`].filepath, newPath, 
                                (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                })
                            }else{
                                const error = {};
                                error[`msg`] = `image${i+1} has invalid ${extension} type`
                                errors.push(error)
                            }
                        }
                        if (errors.length === 0) {
                            try {
                                const response = await productModel.create({
                                    title: parsedData.title,
                                    price: parseInt(parsedData.price),
                                    discount: parseInt(parsedData.discount),
                                    stock: parseInt(parsedData.stock),
                                    category: parsedData.category,
                                    colors: parsedData.colors,
                                    sizes: JSON.parse(fields.sizes),
                                    image1: images['image1'],
                                    image2: images['image2'],
                                    image3: images['image3'],
                                    description: fields.description
                                })
                                return res.status(201).json({msg: 'product has created', response})
                            } catch (error) {
                                console.log(error)
                                return res.status(500).json(error)
                            }
                        } else {
                            return res.status(400).json({errors})    
                        }
                    }else{
                        return res.status(400).json({errors})
                    }
                }else{
                    return res.status(400).json({errors})
                }
            }
        })
    }
    async get(req, res) {
        const {page} = req.params;
        const perPage = 3;                   //The number of categories per page.
        const skip = (page - 1) * perPage;
        try {
            const count = await productModel.find({}).countDocuments();   //The total count of categories in database.
            const response = await productModel.find({})
              .skip(skip)
              .limit(perPage)                //it limits the number of categories to show on one page
              .sort({ updatedAt: -1 });      //it sorts the recently updated categories
            console.log(response);
            return res.status(200).json({products: response, perPage, count})
        } catch (error) {
            console.log(error.message);
        }
    }
    async getProduct(req, res) {
        const { id } = req.params;
        try {
          const product = await productModel.findOne({ _id: id });
          return res.status(200).json(product);
        } catch (error) {
          return res.status(500).json({ error: error.message });
          console.log(error.message);
        }
    }
    async updateProduct(req, res) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          try {
            const {
              _id,
              title,
              price,
              discount,
              stock,
              colors,
              sizes,
              description,
              category,
            } = req.body;
            const response = await productModel.updateOne(
              { _id },
              {
                $set: {
                  title,
                  price,
                  discount,
                  stock,
                  category,
                  colors,
                  sizes,
                  description,
                },
              }
            );
            return res.status(200).json({ msg: "Product has updated", response });
          } catch (error) {
            console.log(error);
            return res.status(500).json({ errors: error });
          }
        } else {
          return res.status(400).json({ errors: errors.array() });
        }
    }
    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
          const product = await productModel.findOne({ _id: id });
          [1, 2, 3].forEach((number) => {
            let key = `image${number}`;
            console.log(key);
            let image = product[key];
            let __dirname = path.resolve();
            let imagePath = __dirname + `/../client/public/images/${image}`;
            fs.unlink(imagePath, (err) => {
              if (err) {
                throw new Error(err);
              }
            });
          });
          await productModel.findByIdAndDelete(id);
          return res
            .status(200)
            .json({ msg: "Product has been deleted successfully" });
        } catch (error) {
          throw new Error(error.message);
        }
    }
}

module.exports = new Product();
