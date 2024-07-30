class Cart{
    //public property
    cartItems;
    //private property
    #localStorageKey;

    constructor(key){
        this.#localStorageKey = key;
        this.#loadFromStorage();
        console.log(this);
    }

    #loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
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
    }

    saveToStorage(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

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
    }

    removeFromCart(productId){
        let newCart = [];
      
        this.cartItems.forEach((cartItem) => {
          if(cartItem.productId !== productId){
            newCart.push(cartItem);
          }
        });
      
        this.cartItems = newCart;
      
        this.saveToStorage();
    }

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

}


const cart = new Cart('cart-oop');

const businessCart = new Cart('business-cart');