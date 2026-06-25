import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import productsModel from './models/productsModel.js';
import categoryModel from './models/categoryModel.js';

configDotenv();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const categories = await categoryModel.find();
        console.log("Categories in DB:");
        console.log(categories);

        const products = await productsModel.find().populate('category');
        console.log("Products in DB:");
        products.forEach(p => {
            console.log(`Product: ${p.name}, Category: ${p.category ? p.category.category : "None"} (ID: ${p.category ? p.category._id : "None"})`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkDB();
