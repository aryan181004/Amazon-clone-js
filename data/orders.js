export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
    // add new order to start
        orders.unshift(order);
        saveToStorage();
}

function saveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders));
}