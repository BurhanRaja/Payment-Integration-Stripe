const express = require('express')
const { v4: uuid4 } = require('uuid')
const cors = require('cors')

// Render env for development
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

// Stripe 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/payment', async (req, res) => {

    const {product, token} = req.body
    console.log('Product', product)
    console.log('Token', token)
    const idempotencyKey = uuid4()

    const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,       
    })

    const createCharge = (customer) => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address:{
                    country: token.card.address_country
                }
            }
        }, {idempotencyKey})
    }

    return createCharge(customer)
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))


})

// Listen
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})