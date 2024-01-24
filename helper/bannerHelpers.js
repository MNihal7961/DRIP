const banner = require('../model/bannermodel')

const addBanner = async (name, description, image) => {
    try {
        const result = await banner.create(
            { title: name, description: description, image: image }
        )
        return result
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    addBanner
}