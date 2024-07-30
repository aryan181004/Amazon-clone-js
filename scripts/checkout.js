//named export
import { cart , removeFromCart , saveToStorage , updateDeliveryOption} from "../data/cart.js";
import { products, getProduct } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { deliveryOption , getDeliveryOption } from "../data/deliveryOptions.js";
//default export
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
//run everything from this file
//import '../data/cart-class.js';


// let today = dayjs();
// let deliveryDate = today.add(7,'days');
// console.log(deliveryDate.format('dddd, MMMM D'));//from documentation of dayjs

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
                        $${matchingProduct.getPrice()}
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

renderOrderSummary();


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

          <button class="place-order-button button-primary">
            Place your order
          </button>
        </div>
    `;

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML;
}

renderPaymentSummary();