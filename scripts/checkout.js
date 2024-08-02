//named export
import { cart , removeFromCart , saveToStorage , updateDeliveryOption , loadCart} from "../data/cart.js";
import { products, getProduct , loadProducts , loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOption , getDeliveryOption } from "../data/deliveryOptions.js";
import { addOrder } from "../data/orders.js";
//default export
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";


// backend file
// import '../data/backend-practice.js'


//run everything from this file
//import '../data/cart-class.js';


// let today = dayjs();
// let deliveryDate = today.add(7,'days');
// console.log(deliveryDate.format('dddd, MMMM D'));//from documentation of dayjs

/**
 * async
 * makes a function return a promise
 */
/**
 * await
 * waits for promise to finish
 * before going to next line
 * 
 * can be used in an async function only
 */
async function loadPage(){
  console.log('load page');
  // try catch for error handling in async await
  try{
    // throw creates an error
    // throw 'error1'

    // await lest us write async code like normal code
    // then() is not needed now
    await loadProductsFetch();

    // value3 is saved in value
    /**
     * reject creates an error in the future
     */
    // const value =
     await new Promise((resolve , reject) => {
      // throw 'error2';
      loadCart(() => {
        // reject('error3');
        resolve('values3');
        
      });
    });
  } catch(error) {
    console.log('unxpected error try catch block. try again later');
  }
  

  renderOrderSummary();
  renderPaymentSummary();


  // if we return something 
  // it becomes as if giving parameter in resolve(param)
  // return 'values2';

}

loadPage();

/** 
 * above code does what
 * 
 * function loadPage(){
 *  return Promise(() => {
 *    console.log('load page');
 *    resolve('values2');
 *  });
 * }
 * 
 * does 
 */

/*
 * runs multiple promises together
 * pass an array of promises
 * then gives next step after all promises are run
 */
/*
      Promise.all([
        loadProductsFetch(),

        new Promise((resolve) => {
          loadCart(() => {
            resolve();
            
          });
        })

      ]).then((values) => {
        console.log(values);
        renderOrderSummary();
        renderPaymentSummary();
      });
/*
// better way to handle async code
// run function immediately
          new Promise((resolve) => {
            // console.log('start promise');
            loadProducts(() => {
              //  console.log('finished loading');
              resolve('value1');
            });

          }).then((value) => {
            // console.log('next Step');
            console.log(value);
            return new Promise((resolve) => {
              loadCart(() => {
                resolve();
                
              }).then(() => {
                renderOrderSummary();
                renderPaymentSummary();
              });
            });
          });
*/
// resolve is a function
// waits till response is done
// then runs next steps after resolve

// giving a value to resolve 
// passes it to parameter 
// in then(value)

/*
 * Promise runs loadProducts in it
 * simultaneously with loadProducts outside
 * it creates another thread along with current one 
 * in this another thread, resolve in run, then then() 
 */


// loadProducts(() => {
//   loadCart(() =>{
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });

/**
 * promises are used to avoid 
 * multiple callbacks of a function
 * to avoid nesting of functions
 */


function renderOrderSummary(){
    let cartSummaryHTML = '';
    cart.forEach((cartItem) => {
        let productId = cartItem.productId;

        let matchingProduct;

        products.forEach((product) => {
            if(product.id === productId){
                matchingProduct = product;
            }
        });

        let deliveryOptionId = cartItem.deliveryOptionId;
        let deliveryOptions;
        deliveryOption.forEach((option) => {
            if(option.id === deliveryOptionId){
            deliveryOptions = option;
            }
        });

        let today = dayjs();
        let deliveryDate = today.add(deliveryOptions.deliveryDays,'days');
        let dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTML += 
        `
            <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image"
                    src="${matchingProduct.image}">

                    <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        ${matchingProduct.getPrice()}
                    </div>
                    <div class="product-quantity">
                        <span>
                        Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary">
                        Update
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                        </span>
                    </div>
                    </div>

                    <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct,cartItem)}
                    </div>
                </div>
                </div>
        `;
    });


function deliveryOptionsHTML(matchingProduct,cartItem){
  let html = ''; 

  deliveryOption.forEach((deliveryOption) => {
    let today = dayjs();
    let deliveryDate = today.add(deliveryOption.deliveryDays,'days');
    let dateString = deliveryDate.format('dddd, MMMM D');
    let priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

    let isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return html;
}


document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            let productId = link.dataset.productId;
            removeFromCart(productId);
            
            document.querySelector(`.js-cart-item-container-${productId}`).remove();

            saveToStorage();
            renderPaymentSummary();
        });
    });

document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
        element.addEventListener('click' , () => {
            let {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

}




// price summary

function renderPaymentSummary(){
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        let product = getProduct(cartItem.productId);
        let deliveryCost = getDeliveryOption(cartItem.deliveryOptionId);
        productPriceCents += product.priceCents * cartItem.quantity; shippingPriceCents += deliveryCost.priceCents;
    });

    let totalBeforeTaxCents = shippingPriceCents + productPriceCents;
    let taxCents = totalBeforeTaxCents*0.1;
    let totalCents = totalBeforeTaxCents + taxCents;

    let paymentSummaryHTML = `
        <div class="payment-summary js-payment-summary">
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>
          
          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
        </div>
    `;

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML;

/** 
 * 4 types of request
 * GET = get someth9ing
 * POST = create something - allows to send data
 * PUT = update something
 * DELETE = delete something
 */

/**
 * pass a object to change request type in fetch
 */
    document.querySelector('.js-place-order')
      .addEventListener('click', async () => {
        try{
          const response = 
          await fetch('https://supersimplebackend.dev/orders',{
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              cart : cart
            })
          });

          // response.json to get data 
          // also a promise
          const order = await response.json();
          addOrder(order);
        } catch(error){
          console.log('unexpected error.');
        }

        // helps us control url
        window.location.href = 'orders.html';
        });
}