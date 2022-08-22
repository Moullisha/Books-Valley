const formidable = require('formidable'); // Node.js module for parsing form data, especially file uploads(image in our case)
const _ = require('lodash');
const fs = require('fs'); 
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const path = require('path');
const multer = require("multer");
// var mongoose = require('mongoose')


// mongoose.connect('mongodb://0.0.0.0:27017/nodedemodb', {
//   useNewUrlParser: true,
// })
// var conn = mongoose.connection
// conn.on('connected', function () {
//   console.log('Database successfully connected')
// })
// conn.on('disconnected', function () {
//   console.log('Database disconnected ')
// })
// conn.on('error', console.error.bind(console));

exports.productById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category')
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.product = product;
            next();
        });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};


var dir = "./public/images";
    if(!fs.existsSync(dir)) {
        console.log("Directory not found!");
        fs.mkdirSync(dir, { recursive : true })
    }

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
console.log("FileStorageEngine", fileStorageEngine)
    
exports.upload = multer({
     storage: fileStorageEngine,
     limits: { fieldSize: 10 * 1024 * 1024}
    });

exports.create = (req, res) => {
    console.log("Request body name", req.body);
    if(!req.file) {
        return res.status(400).json({
            message: "No file found!"
        })
    }
    console.log(req.file);
    // console.log("Image uploaded successfully");
    //check if all fields are present
    const { name, description, price, category, quantity, shipping } = req.body;

    if(!name || !description || !price || !category || !quantity || !shipping ) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // if(mongoose.connection.db.collection('Product').find({ name: req.body.name }))
    //      {
    //     return res.status(400).json({
    //         message: 'Book already exists'
    //     })
    // }

    // if(products.find({name: 'req.body.name'}, {$exists: true})) {
    //     return res.status(400).json({
    //         message: "Book already exists"
    //     })
    // }

    let product = new Product(req.body);
    console.log("Product:", product);

    product.photo.data = req.file.path;
    product.photo.contentType  = req.file.mimetype;

    product.save((err, result) => {
        if(err) {
            console.log("Error creating product");
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        res.json(result)
    })
}


// exports.create = (req, res) => {
//     console.log("Inside create")
//     let form = new formidable.IncomingForm();
//     const uploadFolder = path.join(__dirname, "public", "files");
//     form.uploadDir = uploadFolder;    
//     form.keepExtensions = true;
//     form.multiples = false;
//     console.log(form)
//     form.parse(req, (err, fields, files) => {
//         console.log("Fields", fields);
//         console.log("Files:", files);
//         // console.log("Before error")
//         if (err) {
//             console.log("Error parsing the files")
//             return res.status(400).json({
//                 error: 'Image could not be uploaded'
//             });
//         }
//         // console.log("After error")
//         // check for all fields
//         const { name, description, price, category, quantity, shipping } = fields;

//         if (!name || !description || !price || !category || !quantity || !shipping) {
//             return res.status(400).json({
//                 error: 'All fields are required'
//             });
//         }

//         let product = new Product(fields);

//         // 1kb = 1000
//         // 1mb = 1000000

//         if (files.photo) {
//             // console.log("FILES PHOTO: ", files.photo);
//             if (files.photo.size > 5000000) {
//                 return res.status(400).json({
//                     error: 'Image should be less than 5mb in size'
//                 });
//             }
//             product.photo.data = fs.readFileSync(files.photo.filepath);
//             product.photo.contentType = files.photo.mimetype;
//         }

//         product.save((err, result) => {
//             if (err) {
//                 console.log('ERROR CREATING PRODUCT ', err);
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             }
//             res.json(result);
//         });
//     });
// };

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            deletedProduct,
            message: `${deletedProduct.name} has been successfully deleted`
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 7;

    Product.find()
        .select('-photo') //deselect photo
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0], //greater than
                    $lte: req.body.filters[key][1]  // less than
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'No products found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if(!req.product.photo.data){
        return res.status(400).json({
            message: "Image not found!"
        })
    }
    if (req.product.photo.data) {
        console.log("Photo", req.product.photo);
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};