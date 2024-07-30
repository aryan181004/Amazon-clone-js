//function to generate multiple copies of object
function Cart(localStorageKey){
    //cart object
    const cart = {
        cartItems : undefined,
    
        loadFromStorage() {
            this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));
            if(!this.cartItems){
                this.cartItems = [
                  {
                    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                    quantity: 2,
                    deliveryOptionId: '1'
                  },
                  {
                    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                    quantity: 1,
                    deliveryOptionId: '1'
                  }
                ];
              }
        },
    
        saveToStorage(){
            localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
        },
        
        addToCart(productId){
            let matchingItem;
            this.cartItems.forEach((cartItem) => {
              if(productId === cartItem.productId){
                matchingItem = cartItem;
              }
            });
        
            if(matchingItem){
              matchingItem.quantity++;
            }
            else{
              this.cartItems.push({
                productId ,
                quantity : 1,
                deliveryOptionId: '1'
              });
            }
        
            this.saveToStorage();
        },
    
        removeFromCart(productId){
            let newCart = [];
          
            this.cartItems.forEach((cartItem) => {
              if(cartItem.productId !== productId){
                newCart.push(cartItem);
              }
            });
          
            this.cartItems = newCart;
          
            this.saveToStorage();
        },
    
        updateDeliveryOption(productId, deliveryOptionID){
            let matchingItem;
          
            this.cartItems.forEach((cartItem) => {
              if(productId === cartItem.productId){
                matchingItem = cartItem;
              }
            });
          
            matchingItem.deliveryOptionId = deliveryOptionID;
            this.saveToStorage();
        }
    
    };

    return cart;
}

const cart = Cart('cart-oop');
cart.loadFromStorage();
cart.addToCart('8c9c52b5-5a19-4bcb-a5d1-158a74287c53');
console.log(cart);

const businessCart = Cart('business-cart');









