const cart = require('../model/cartmodel')
const { ObjectId } = require('mongodb')

const addToCart = async (proId, userId, sizeSelect) => {
    try {
        let userCart = await cart.findOne({ user: new ObjectId(userId) });

        if (userCart) {
            let productExist = userCart.cartItems.findIndex(
                cartItem => cartItem.products == proId && cartItem.size == sizeSelect
            );
            if (productExist !== -1) {
                await cart.updateOne(
                    { 'user': new ObjectId(userId), 'cartItems.products': new ObjectId(proId), 'cartItems.size': sizeSelect },
                    { $inc: { 'cartItems.$.quantity': 1 } }
                );
            } else {
                await cart.updateOne(
                    { user: new ObjectId(userId) },
                    { $push: { cartItems: { products: proId, quantity: 1, size: sizeSelect } } }
                );
            }
        } else {
            let cartObj = {
                user: new ObjectId(userId),
                cartItems: [{ products: proId, quantity: 1, size: sizeSelect }]
            };
            await cart.create(cartObj);
        }

        return Promise.resolve(); 
    } catch (err) {
        console.log(err);
        return Promise.reject(err); 
    }
}

const getCartProducts = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await cart.aggregate([

                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {
                        item: '$cartItems.products',
                        quantity: '$cartItems.quantity',
                        size: '$cartItems.size'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: "item",
                        foreignField: "_id",
                        as: 'cartItems'
                    }
                }, {
                    $project: {
                        item: 1,
                        quantity: 1,
                        size: 1,
                        product: { $arrayElemAt: ['$cartItems', 0] }
                    }
                }

            ]).then((cartItems) => {
                resolve(cartItems)
            })
        } catch (err) {
            console.log(err)
        }
    })
}

const changeProductQuantity = (data) => {
    const count = parseInt(data.count)
    const size = parseInt(data.size)
    return new Promise(async (resolve, reject) => {
        try {
            await cart.updateOne(
                {
                    '_id': new ObjectId(data.cart),
                    'cartItems': {
                        $elemMatch: {
                            'products': new ObjectId(data.product),
                            'size': size
                        }
                    }
                },
                {
                    $inc: { 'cartItems.$.quantity': count }
                }
            ).then(() => {
                resolve({ status: "success" })
            })
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

const deleteCartItem = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userCart = await cart.findOne({ user: new ObjectId(data.userId) })
            let productIndex = userCart.cartItems.findIndex(cartItem => cartItem.products == data.product)

            if (productIndex !== -1 && userCart.cartItems[productIndex].size === parseInt(data.size)) {
                await cart.updateOne(
                    { '_id': new ObjectId(data.cartId) },
                    {
                        $pull: { 'cartItems': { $exists: true } }
                    }
                ).then(async () => {
                    userCart.cartItems.splice(productIndex, 1)
                    await cart.updateOne(
                        { '_id': new ObjectId(data.cartId) },
                        {
                            $set: { 'cartItems': userCart.cartItems }
                        }
                    );
                    resolve({ removeProduct: true })
                });
            } else {
                resolve({ removeProduct: false, message: 'Product not found or size does not match.' })
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}

const getTotalAmount = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await cart.aggregate([

                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {
                        item: '$cartItems.products',
                        quantity: '$cartItems.quantity'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: "item",
                        foreignField: "_id",
                        as: 'cartItems'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$cartItems', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.mrp'] } }
                    }
                }
            ]).then((total) => {
                resolve(total[0].total)
            })
        } catch (err) {
            console.log(err);
        }
    })
}

const getTotalAmountOfEachItem = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await cart.aggregate([

                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {
                        item: '$cartItems.products',
                        quantity: '$cartItems.quantity',
                        size: '$cartItems.size'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: "item",
                        foreignField: "_id",
                        as: 'cartItems'
                    }
                }, {
                    $project: {
                        item: 1,
                        quantity: 1,
                        size: 1,
                        product: { $arrayElemAt: ['$cartItems', 0] }
                    }
                }, {
                    $project: {
                        total: { $sum: { $multiply: ['$quantity', '$product.mrp'] } }
                    }
                }

            ]).then((cartItems) => {
                resolve(cartItems)
            })
        } catch (err) {
            console.log(err)
        }
    })
}






module.exports = {
    addToCart,
    getCartProducts,
    changeProductQuantity,
    deleteCartItem,
    getTotalAmount,
    getTotalAmountOfEachItem,
}
