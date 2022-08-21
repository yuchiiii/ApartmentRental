const Housing = require('../models/housing');
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const housings = await Housing.find();
    res.render('housings/index', { housings })
}

module.exports.renderNewForm = (req, res) => {
    res.render('housings/new')
}

module.exports.createHousing = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.housing.location,
        limit: 1
    }).send()
    const housing = new Housing(req.body.housing);
    housing.geometry = geoData.body.features[0].geometry;
    housing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    housing.author = req.user._id;
    await housing.save();
    console.log(housing);
    req.flash('success', 'Successfully added a new housing!');
    res.redirect(`/housings/${housing._id}`)
}

module.exports.showHousing = async (req, res) => {
    const housing = await Housing.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!housing) {
        req.flash('error', 'Cannot find that housing!');
        return res.redirect('/housings');
    }
    res.render('housings/show', { housing })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const housing = await Housing.findById(id);
    if (!housing) {
        req.flash('error', 'Cannot find that housing!');
        return res.redirect('/housings');
    }
    res.render('housings/edit', { housing })
}

module.exports.updateHousing = async (req, res) => {
    const { id } = req.params;
    const housing = await Housing.findByIdAndUpdate(id, { ...req.body.housing });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    housing.images.push(...imgs);
    await housing.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await housing.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated housing!')
    res.redirect(`/housings/${housing._id}`)
}

module.exports.deleteHousing = async (req, res) => {
    const { id } = req.params;
    await Housing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a housing!')
    res.redirect('/housings');
}