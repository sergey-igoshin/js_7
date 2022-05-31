/*
1. Реализовать страницу корзины:
a. Добавить возможность не только смотреть состав корзины, но и редактировать его,
обновляя общую стоимость или выводя сообщение «Корзина пуста»
*/

const products = [
  {name: 'Asus', price: 900, quantity: 1,},
  {name: 'Lenovo', price: 1200, quantity: 5,},
  {name: 'Epson', price: 300, quantity: 2,},  
];

const cart = [];

const dict = {  
  cart_null: 'Корзина пустая',
  add_to_cart: 'В корзину',
  del_from_cart: 'Удалить',
  total: 'Всего товаров: ',
  amount: 'На сумму: ',
  in_stock: 'в наличии',
  out_of_stock: 'нет в наличии',
  currency: '₽',
  unit: 'шт', 
};

const cls = {
  market: 'market',
  cart: 'cart',
  product: 'product',
  text: 'text',
  right: 'right',
  footer: 'footer'
};

const main = { 
  cart,
  products,
  dict,
  cls,

  containerElement: document.querySelector('div'),
  init(){
    this.containerElement.innerHTML = '';    
    this.initProduct(); 
    this.initCart();
  },

  initProduct(){    
    this.createStoreCartBlock(this.cls.market, this.dict.add_to_cart, this.products, false)    
    document.querySelector(`.${this.cls.market}`).addEventListener('click', this.cartAddProduct.bind(this)); 
  },

  initCart(){
    const obj = {total: 0, quantity: 0};
    footer = this.createStoreCartBlock(this.cls.cart, this.dict.del_from_cart, this.cart, obj)    
    this.footerCart(footer, obj);
    document.querySelector(`.${this.cls.cart}`).addEventListener('click', this.cartDelProduct.bind(this)); 
  }, 

  createStoreCartBlock(cls, dict, product, obj){
    const store_cart = this.createStoreCart(cls);
    product.forEach(function(el){
      main.createProductBlocks(store_cart, el, dict, cls, obj);
    }); 
    return store_cart
  },

  createStoreCart(cls){
    const store_cart = document.createElement('div');
    store_cart.classList.add(cls);
    this.containerElement.appendChild(store_cart);
    return store_cart;
  },

  createProductBlocks(store_cart, el, name_btn, cls, obj){
    const product_block = this.productBlock();      
     
    Object.keys(el).forEach(function(key){
      main.block(product_block, el, key, cls, obj);
    });
    if(name_btn){
      const btn = this.createButton(name_btn);          
      product_block.appendChild(btn);
    };
    store_cart.appendChild(product_block);
  },

  productBlock(){
    const product_block = document.createElement('div');
    product_block.classList.add(this.cls.product);
    return product_block;
  },

  createButton(name_btn){
    const btn = document.createElement('button');
    btn.innerText = name_btn;
    return btn
  },

  block(store_product, el, key, cls, obj){
    if(obj){
      if(key === 'price') obj.total += el[key];
      if(key === 'quantity') obj.quantity += el[key];
    } 
    const product = this.createProduct(key, el, cls);
    store_product.appendChild(product);
  },

  createProduct(key, el, cls){
    const product = document.createElement('div');
    this.setBlock(product, key, el, cls);
    return product;
  },

  setBlock(product, key, el, cls){
    let text = '';
    if(key === 'name'){
      text = el[key];
    }else if(key === 'price' && el['quantity'] > 0){
      text = el[key] + ' ' + this.dict.currency; 
      product.classList.add(this.cls.right);         
    }else if(key === 'quantity'){
      if(cls === this.cls.market) {
        el[key] < 1 ? text = this.dict.out_of_stock : text = this.dict.in_stock;
      }else if(cls === this.cls.cart){
        text = el[key] + ' ' + this.dict.unit;
      } 
      product.classList.add(this.cls.right);     
    }
    product.innerText = text;
    product.classList.add(this.cls.text);  
  },

  footerCart(store_cart, obj){
    if(obj.quantity > 0){
      const total = this.dict.total + obj.quantity  + ' ' + this.dict.unit;
      const amount = this.dict.amount + obj.total + ' ' + this.dict.currency;      
      store_cart.appendChild(this.footer(total));
      store_cart.appendChild(this.footer(amount));
    }else{
      store_cart.appendChild(this.footer(this.dict.cart_null));
    }      
  }, 

  footer(text){
    const footer_cart = document.createElement('div');
    footer_cart.classList.add(this.cls.footer);
    footer_cart.innerText = text;
    return footer_cart;
  },

  cartAddProduct(e){      
    if(e.target.tagName !== 'BUTTON') return;    
    this.products.forEach(function(el){
      if(el.name === e.path[1].firstChild.innerText){
        if(el.quantity < 1){
          alert(el.name + ': ' + main.dict.out_of_stock);
        }else{
          main.cart.push({name: el.name, price: el.price, quantity: 1});
          el.quantity -= 1; 
        };      
      };     
    });
    this.init();
  },

  cartDelProduct(e){
    if(e.target.tagName !== 'BUTTON') return;    
    let block_product = document.querySelector(`.${this.cls.cart}`);
    let idx = [...block_product.children].indexOf(e.target.parentNode);
    this.products.forEach(function(el){
      if(el.name === e.path[1].firstChild.innerText){
        el.quantity += 1;
        main.cart.splice(idx, 1);
      };     
    });
    this.init();
  }  
}

main.init();