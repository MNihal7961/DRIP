const salesHelper = require('../helper/salesReportHelper')



// Admin sales-report GET
const adminsalesreport_get = async (req, res) => {
    try {
        const monthlyRevenue = await salesHelper.monthlySales()
        const dailyRevenue = await salesHelper.dailySales()
        const yearlyRevenue = await salesHelper.yearlySales()
        const monthWise = await salesHelper.monthWiseSales()
        const title = "sales-report"
        res.render('admin-sales-report', { title, monthlyRevenue, dailyRevenue, yearlyRevenue, monthWise })
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    adminsalesreport_get
}