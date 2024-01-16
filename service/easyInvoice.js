const easyinvoice=require('easyinvoice')
const path=require('path')
const fs=require('fs')


const  generateInvoice=async(orderData)=>{
    try{

        var data={
            "customize":{

            },
            "images":{
                "logo": "https://img.freepik.com/free-vector/modern-sport-sneakers-blue-color-with-white-shoelaces-realistic-single-image-white-background-isolated-illustration_1284-31208.jpg?size=626&ext=jpg&ga=GA1.1.580309104.1704433060&semt=ais",
            },
            "sender": {
                "company": "Drip-Store Official",
                "address": "kallai",
                "zip": "673524",
                "city": "Calicut",
                "country": "Kerala",
                "gmail":"dripstooff@gmail.com"
            },
            "client": {
               
            },
            "information": {
                "date": new Date(orderData.order[0].orderedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            },
            "products": (orderData.order[0].productDetails && orderData.order[0].productDetails.length > 0) ? orderData.order[0].productDetails.map((product) => ({
                "quantity": product.quantity,
                "description": product.productsName, 
                "tax-rate": 18,
                "price": product.productsPrice
            })) : [],
            

            "bottom-notice": "Thank You For Your Purchase",
            "settings": {
                "currency": "USD",
                "tax-notation": "vat",
                "currency": "INR",
                "tax-notation": "GST",
                "margin-top": 50,
                "margin-right": 50,
                "margin-left": 50,
                "margin-bottom": 25
            },

      
    }
        const result = await easyinvoice.createInvoice(data);
        const filePath = path.join(__dirname, '../public', 'pdf', `${orderData.order[0]._id}.pdf`);
        await fs.promises.writeFile(filePath, result.pdf, 'base64');

        return filePath;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
module.exports={
    generateInvoice
}