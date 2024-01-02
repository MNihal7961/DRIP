const order = require("../model/ordermodel");

// get daily sales
const dailySaless = async () => {
    try {
        const currentDate = new Date();
        const startOfDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            0,
            0,
            0,
            0
        );
        const endOfDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
            999
        );
        const dayOfWeek = currentDate.getDay();
        const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const adjustedDaysOfWeek = daysOfWeek
            .slice(dayOfWeek)
            .concat(daysOfWeek.slice(0, dayOfWeek));

        const dailySales = await order.aggregate([
            {
                $unwind:'$order'
            },
            {
                $match: {
                    'order.deliveredAt': { $gte: startOfDay, $lte: endOfDay },
                    'order.orderStatus': "Paid",
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: "order.deliveredAt" }, 
                    totalSales: { $sum: "order.totalPrice" },
                },
            },
            {
                $sort: { _id: 1 }, 
            },
        ]);

        const salesData = Array(7).fill(0);
        dailySales.forEach((dayData) => {
            const dayIndex = dayData._id - 1; 
            salesData[dayIndex] = dayData.totalSales;
        });

        const salesByDayOfWeek = adjustedDaysOfWeek.map((day, index) => ({
            dayOfWeek: day,
            totalSales: salesData[index],
        }));
        console.log("dayofweek", dayOfWeek);

        console.log("salesByDayOfWeek", salesByDayOfWeek);

        return {dayOfWeek,salesByDayOfWeek}
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({
                success: false,
                error: "An error occurred while fetching daily sales data",
            });
    }
}

const monthlySales = () => {
    let date = new Date();
    let thisMonth = date.getMonth();

    return new Promise(async (resolve, reject) => {
        try {
            await order
                .aggregate([
                    {
                        $unwind: "$order",
                    },
                    {
                        $match: {
                            "order.orderStatus": "Delivered",
                            "order.paymentStatus": "Paid",
                        },
                    },
                    {
                        $unwind: "$order.productDetails",
                    },
                    {
                        $match: { "order.productDetails.status": true },
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $month: "$order.orderedAt",
                                    },
                                    thisMonth + 1,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$order.totalPrice" },
                            orders: { $sum: "$order.productDetails.quantity" },
                            totalOrders: { $sum: "$order.totalQuantity" },
                            count: { $sum: 1 },
                        },
                    },
                ])
                .then((data) => {
                    console.log(data, "/////////");
                    resolve({ status: true, data: data });
                });
        } catch (err) {
            console.log(err);
        }
    });
};

const dailySales = () => {
    let date = new Date();
    let thisDay = date.getDate();

    return new Promise(async (resolve, reject) => {
        try {
            const data = await order.aggregate([
                {
                    $unwind: "$order",
                },
                {
                    $match: {
                        "order.orderStatus": "Delivered",
                        "order.paymentStatus": "Paid",
                    },
                },
                {
                    $unwind: "$order.productDetails",
                },
                {
                    $match: { "order.productDetails.status": true },
                },
                {
                    $match: {
                        $expr: {
                            $eq: [{ $dayOfMonth: { $toDate: "$order.orderedAt" } }, thisDay],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$order.totalPrice" },
                        orders: { $sum: "$order.totalQuantity" },
                        count: { $sum: 1 },
                    },
                },
            ]);

            console.log(data);
            resolve({ status: true, data: data });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

const yearlySales = () => {
    let date = new Date();
    let year = date.getFullYear();

    return new Promise(async (resolve, reject) => {
        try {
            await order
                .aggregate([
                    {
                        $unwind: "$order",
                    },
                    {
                        $match: {
                            "order.orderStatus": "Delivered",
                            "order.paymentStatus": "Paid",
                        },
                    },
                    {
                        $unwind: "$order.productDetails",
                    },
                    {
                        $match: { "order.productDetails.status": true },
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: "$order.orderedAt",
                                    },
                                    year,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$order.totalPrice" },
                            orders: { $sum: "$order.totalQuantity" },
                            count: { $sum: 1 },
                        },
                    },
                ])
                .then((data) => {
                    resolve({ status: true, data: data });
                });
        } catch (err) {
            console.log(err);
        }
    });
};

const monthWiseSales = async () => {
    const data = [];

    try {
        for (let i = 0; i < 12; i++) {
            const monthlyData = await order.aggregate([
                { $unwind: "$order" },
                {
                    $match: {
                        "order.orderStatus": "Delivered",
                        "order.paymentStatus": "Paid",
                    },
                },
                { $unwind: "$order.productDetails" },
                {
                    $match: { "order.productDetails.status": true },
                },
                {
                    $match: {
                        $expr: { $eq: [{ $month: "$order.orderedAt" }, i + 1] },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$order.totalPrice" },
                        orders: { $sum: "$order.totalQuantity" },
                        count: { $sum: 1 },
                    },
                },
            ]);

            if (monthlyData.length > 0) {
                data.push(monthlyData[0]);
            } else {
                data.push({ total: 0, orders: 0, count: 0 });
            }
        }

        return { status: true, data: data };
    } catch (err) {
        console.log(err);
        return { status: false, error: err.message };
    }
};

module.exports = {
    monthlySales,
    dailySales,
    yearlySales,
    monthWiseSales,
};
