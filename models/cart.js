module.exports = function Cart(oldCart) {
    //A new cart will be created and the values of the old card have to be passed in the function
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    //when an item is already in the cart the quantity will be increased
    this.add = function(item, id){
         //the new item will not be treated as a single item but as an item goup
        var storedItem = this.items[id];
        //if its a new item it will be added as a new entry
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};