const payment = require('../model/paymentmodel')

// Payment GET
const payment_get = async (req, res) => {
    try {
        const title = "payment"
        var i = 0
        const paymentData = await payment.find()
        res.render('admin-payment', { title, i, paymentData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add payment GET
const addpayment_get = (req, res) => {
    try {
        const title = 'Add payment'
        res.render('admin-add-payment', { title })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add payment POST
const addpayment_post = async (req, res) => {
    const { name, type, server } = req.body
    const existPayment = await payment.findOne({ title: name })
    try {
        if (existPayment) {
            res.redirect('/admin/add/payment?message=This payment already exist')
        } else {
            const new_payment = await payment.create({
                title: name,
                paymentType: type,
                serverType: server
            })
            res.redirect('/admin/payment?message=Successfully added new payment')
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Disable payment POST
const disablepayment_post = async (req, res) => {
    const id = req.params.id
    try {
        const disable = await payment.updateOne({ _id: id }, { $set: { status: false } })
        res.redirect('/admin/payment?message=disabled')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Enable payment POST
const enablepayment_post = async (req, res) => {
    const id = req.params.id
    try {
        const enable = await payment.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/admin/payment?message=enabled')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit payment GET
const editpayment_get = async (req, res) => {
    const id = req.params.id
    try {
        const data = await payment.findOne({ _id: id })
        const title = "edit payment"
        res.render('admin-edit-payment', { title, data })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit payment POST
const editpayment_post = async (req, res) => {
    const { name, type, server } = req.body
    const existPayment = await payment.findOne({ title: name })
    try {
        if (existPayment) {
            res.redirect('/admin/add/payment?message=This payment already exist')
        } else {
            const new_payment = await payment.updateOne({
                title: name,
                PaymentType: type,
                serverType: server
            })
            res.redirect('/admin/payment?message=Successfully updated payment')
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Delete payment POST
const deletpayment_post = async (req, res) => {
    const id = req.params.id
    try {
        const deletePayment = await payment.deleteOne({ _id: id })
        res.redirect('/admin/payment?message=deleted')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

module.exports = {
    payment_get,
    addpayment_get,
    addpayment_post,
    disablepayment_post,
    enablepayment_post,
    editpayment_get,
    editpayment_post,
    deletpayment_post
}
