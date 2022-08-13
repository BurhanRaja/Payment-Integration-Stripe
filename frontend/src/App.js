import StripeCheckout from 'react-stripe-checkout';
import './App.css';

function App() {

  const productInfo = {
    name:"T-Shirt",
    price: 1200,
    currency: "INR"
  }

  const getToken = async (token) => {
    const body = {
      token,
      product: {
        name: "T-Shirt",
        price: 1200,
        productBy: "Nike"
      }
    }

    let response = await fetch('http://localhost/5000/payment', {
      method:'POST',
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    response = await response.json()
    console.log("RESPONSE", response)
    const {status} = response
    console.log("STATUS", status)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src="/assets/payment-image.jpg" style={{"height":"300px", "marginBottom":"30px"}} alt="logo" />
        <StripeCheckout
        name={productInfo.name}
        stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
        token={getToken}
        amount={productInfo.price * 100}
        currency={productInfo.currency}
        shippingAddress
        >
          {console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)}
          <button className='btn btn-primary'>Buy T-Shirt in ₹{productInfo.price}</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
