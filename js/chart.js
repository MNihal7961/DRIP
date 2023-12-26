const order = require('../model/ordermodel')

const codCount = async () => {
    try {
        const count = await order.aggregate([
            {
                $unwind: "$order"
            },
            {
                $match: {
                    "order.paymentMethod": "COD"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    orderCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrderCount: { $sum: "$orderCount" }
                }
            }
        ])

        return count[0].totalOrderCount
    } catch (err) {
        console.log(err)
    }
}

const onlineCount = async () => {
    try {
        const count = await order.aggregate([
            {
                $unwind: "$order"
            },
            {
                $match: {
                    "order.paymentMethod": "razorpay"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    orderCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrderCount: { $sum: "$orderCount" }
                }
            }
        ])

        return count[0].totalOrderCount
    } catch (err) {
        console.log(err)
    }
}

const chartData = {
    labels: ["COD", "online"],
    data: [codCount, onlineCount]
}

const myChart = document.getElementById('my-chart')

new Chart(mychart, {
    type: "doughnut",
    data: {
        labels: chartData.labels,
        datasets: [
            {
                label: "Payment Methods Used",
                data: chartData.data
            }
        ]
    }
})