const salesHelper = require("../helper/salesReportHelper");

// Admin sales-report GET
const adminsalesreport_get = async (req, res) => {
  try {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentDay = daysOfWeek[currentDate.getDay()];
    const monthlyRevenue = await salesHelper.monthlySales();
    const dailyRevenue = await salesHelper.dailySales();
    const yearlyRevenue = await salesHelper.yearlySales();
    const monthWise = await salesHelper.monthWiseSales();
    const title = "sales-report";
    const weeklyRevenue = await salesHelper.weekWiseSales();
    const currentYear = new Date().getFullYear();
    res.render("admin-sales-report", {
      currentDay,
      currentMonth,
      currentYear,
      title,
      monthlyRevenue,
      dailyRevenue,
      yearlyRevenue,
      monthWise,
      weeklyRevenue,
    });
  } catch (err) {
    res.status(500).render("500");
    console.log(err);
  }
};

module.exports = {
  adminsalesreport_get,
};
