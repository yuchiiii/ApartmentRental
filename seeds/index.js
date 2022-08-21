const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Housing = require('../models/housing');

mongoose.connect('mongodb://localhost:27017/college-rental')
    .then(() => {
        console.log("connection open!")
    })
    .catch(err => {
        console.log('Error:')
        console.log(err)
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Housing.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000) + 20;
        const housing = new Housing({
            author: '62bfc2b42cf51d6b0a0283a3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam sunt quo provident, in saepe alias neque repellat ab perferendis, laboriosam maiores ipsam corporis, soluta sapiente doloribus eaque optio fugiat quibusdam.',
            price,
            geometry: {
                "type": "Point",
                "coordinates": [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhf2mlpr9/image/upload/v1657688378/CollegeRental/pgwqzmc7wsyn8o7lgi2m.jpg',
                    filename: 'CollegeRental/fjcujxll1t3f38koyyiv',
                },
                {
                    url: 'https://res.cloudinary.com/dhf2mlpr9/image/upload/v1657665975/CollegeRental/natheikc1hqyrre23s8o.jpg',
                    filename: 'CollegeRental/ziya0yov5vxl9lhfyxmw',
                }
            ]
        })
        await housing.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
});
