const address = require('../model/addressmodel')
const { ObjectId } = require('mongodb');




const addNewAddress = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            addressData = {
                fname: data.firstname,
                lname: data.lastname,
                street: data.street,
                buildingName: data.building,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                mobile: data.mobile,
                email: data.email
            }

            let addressExist = await address.findOne({ user: userId })

            if (addressExist) {
                await address.updateOne(
                    {
                        user: userId
                    },
                    {
                        $push: { address: addressData }
                    }
                ).then(() => {
                    resolve({ status: true })
                })
            } else {
                const newAddress = await address.create({ user: userId, address: addressData }).then(() => {

                    resolve({ status: true })
                })
            }
        } catch (err) {
            console.log(err)
        }
    })
}

const getAddress = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let addressData = await address.find({ user: userId })
            resolve(addressData)
        } catch (err) {
            console.log(err)
        }
    })
}

const getSingleAddress = async (addrId, userId) => {
    try {
        console.log('Address ID:', addrId);
        console.log('User ID:', userId);

        const Address = await address.aggregate([
            { $match: { user: new ObjectId(userId) } },
            { $unwind: '$address' },
            { $match: { 'address._id': new ObjectId(addrId) } }
        ]);

        console.log('Result:////////********////////', Address);

        return Address;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const editAddress = async (data, userId, id) => {
    try {
        console.log("Start of editAddress");

        const userAddress = await address.findOne({ user: new ObjectId(userId) });
        if (!userAddress) {
            throw new Error("User address not found");
        }

        console.log("User Address:", userAddress);

        const addressIndex = userAddress.address.findIndex(addr => addr._id == id);
        if (addressIndex === -1) {
            throw new Error("Address not found");
        }

        console.log("Address Index:", addressIndex);

        const updatedAddress = {
            fname: data.firstname,
            lname: data.lastname,
            street: data.street,
            apartment: data.apartment,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            mobile: data.mobile,
            email: data.email,
        };

        userAddress.address[addressIndex] = updatedAddress;
        await userAddress.save();

        console.log("Update Successful");

        return { status: true };
    } catch (err) {
        console.log("Error:", err);
        return { status: false, error: err.message };
    }
}

const deleteAddress= (userId, addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            address.updateOne(
                {
                    userId: userId,

                },
                {
                    $pull: { address: { _id: addressId } }
                }
            ).then((e) => {
                // console.log(e);
                resolve({ status: true })
            })
        } catch (err) {
            res.status(500).render('500')
            console.log(err)
        }
    })
}

module.exports = {
    addNewAddress,
    getAddress,
    getSingleAddress,
    editAddress,
    deleteAddress
}