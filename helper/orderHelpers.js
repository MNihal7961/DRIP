const cart = require('../model/cartmodel')
const product = require('../model/productmodel')
const { ObjectId } = require('mongodb')
const users = require('../model/usermodel')
const shipping = require('../model/shippingmodel')
const order = require('../model/ordermodel')

const placeOrder = (user, shipping, address, total, payment) => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await cart.aggregate([
                {
                    $match: { user: new ObjectId(user._id) }
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
                        localField: 'item',
                        foreignField: '_id',
                        as: 'cartItemsRs'
                    }
                },
                {
                    $unwind: '$cartItemsRs'
                },
                {
                    $project: {
                        _id: '$cartItemsRs._id',
                        quantity: 1,
                        size: 1,
                        productsName: '$cartItemsRs.title',
                        productsPrice: '$cartItemsRs.mrp',
                        productImage: '$cartItemsRs.images',
                    }
                }
            ]);

            //totalQuatity calculation
            let totalQuantity = products.reduce((acc, curr) => acc + curr.quantity, 0);

            //address
            let Address = {
                fname: address[0].address.fname,
                lname: address[0].address.lname,
                street: address[0].address.street,
                buildingName: address[0].address.buildingName,
                city: address[0].address.city,
                state: address[0].address.state,
                pincode: address[0].address.pincode,
                mobile: address[0].address.mobile,
                email: address[0].address.email
            };

            // Inventory management - Update product quantities
            for (let i = 0; i < products.length; i++) {
                const productId = products[i]._id;
                const sizeToUpdate = products[i].size;
                const quantityToUpdate = products[i].quantity;

                await product.updateOne(
                    {
                        _id: productId,
                        'varient.size': sizeToUpdate
                    },
                    {
                        $inc: { 'varient.$.quantity': -quantityToUpdate }
                    }
                );
            }

            const mappedProducts = products.map(product => ({
                quantity: product.quantity,
                size: product.size,
                _id: product._id,
                productsName: product.productsName,
                productsPrice: product.productsPrice,
                productImage: product.productImage,
                status: true
            }));

            let orderData = {
                userId: user._id,
                buyerName: user.username,
                shippingAddress: Address,
                billingAddress: Address,
                totalPrice: total,
                paymentMethod: payment,
                totalQuantity: totalQuantity,
                shippingMethod: shipping.title,
                productDetails: mappedProducts,
            };

            const orderExist = await order.findOne({ user: user._id });

            if (orderExist) {
                await order.updateOne(
                    { user: user._id },
                    { $push: { order: orderData } }
                );
                resolve({ order: "success" });
            } else {
                const newOrder = new order({
                    user: user._id,
                    order: [orderData]
                });

                await newOrder.save();
                resolve({ order: "success" });
            }

            cart.deleteMany({ user: new ObjectId(user._id) }).then((response) => {
                resolve({ order: "success" });
            });

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};


const adminProcessOrder = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            await order.updateOne(
                { "order._id": new ObjectId(orderId) },
                { $set: { "order.$.orderStatus": status } }
            ).then((response) => {
                resolve({ update: "success" })
            })

        } catch (err) {
            console.log(err)
        }
    })
}

const adminPlaceOrder = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            await order.updateOne(
                { "order._id": new ObjectId(orderId) },
                { $set: { "order.$.orderStatus": status } }
            ).then((response) => {
                resolve({ update: "success" })
            })
        } catch (err) {
            console.log(err)
        }
    })
}

const adminShipOrder = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            await order.updateOne(
                { "order._id": new ObjectId(orderId) },
                { $set: { "order.$.orderStatus": status } }
            ).then((response) => {
                resolve({ update: "success" })
            })
        } catch (err) {
            console.log(err)
        }
    })
}

const adminDeliveryOrder = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            await order.updateOne(
                { "order._id": new ObjectId(orderId) },
                { $set: { "order.$.orderStatus": status } }
            ).then((response) => {
                resolve({ update: "success" })
            })
        } catch (err) {
            console.log(err)
        }
    })
}

const userCancelOrder = (orderId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await order.updateOne(
                { user: userId, "order._id": new ObjectId(orderId) },
                { $set: { "order.$.orderStatus": "Cancelled" } }
            ).then((response) => {
                resolve({ update: "success" })
            })
        } catch (err) {
            console.log(err)
        }
    })
}

const userCancelSingleProduct = (userId, orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await order.updateOne(
                { user: new ObjectId(userId), "order._id": new ObjectId(orderId) },
                { $set: { "order.$.productDetails.$[inner].status": false } },
                { arrayFilters: [{ "inner.status": true }] } // Apply a filter for status=true
            );

            if (result.nModified > 0) {
                resolve({ update: "success" });
            } else {
                resolve({ update: "failed", reason: "No modifications" });
            }
        } catch (err) {
            reject(err);
        }
    });
};


module.exports = {
    placeOrder,
    adminProcessOrder,
    adminPlaceOrder,
    adminShipOrder,
    adminDeliveryOrder,
    userCancelOrder,
    userCancelSingleProduct
}