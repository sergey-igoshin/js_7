/*
2. На странице корзины:
a. Сделать отдельные блоки «Состав корзины», «Адрес доставки», «Комментарий»;
b. Сделать эти поля сворачиваемыми;
c. Заполнять поля по очереди, то есть давать посмотреть состав корзины, внизу которого
есть кнопка «Далее». Если нажать ее, сворачивается «Состав корзины» и открывается
«Адрес доставки» и так далее.
*/

const products = [
  {
    title: 'Норвежский салат', 
    description: 'Микс салата с нежнейшим лососем и сырным муссом', 
    price: 950,
    img: 'norwegian_salad.jpg',
    currency: '₽',
  },
  {
    title: 'Кальмар на пару/гриле', 
    description: 'Дары моря, приготовленный с любовью по вашему желанию', 
    price: 1500,
    img: 'steamed_squid.jpg',
    currency: '₽',
  }, 
  {
    title: 'Омлет со шпинатом', 
    description: 'Полезный и легкий завтрак для здорового начала дня', 
    price: 600,
    img: 'spinach_omelet.jpg',
    currency: '₽',
  },
  {
    title: 'Яйцо пашот на выбор', 
    description: 'Сытный и полезный завтрак на органическом хлебе Монж', 
    price: 500,
    img: 'poached_egg.jpg',
    currency: '₽',
  } 
];

const cart = [];

const dict = {  
  cart_null: 'Корзина пустая',
  order: 'Заказать',
  del: 'Удалить',
  next: 'Дальше',
  total: 'Всего товаров',
  amount: 'На сумму',
  currency: '₽',
  unit: 'шт',
  your_order: 'Ваш заказ',
  address: 'Адрес доставки',
  comment: 'Комментарий',
  placeholder:{
    address: 'Укажите адрес доставки',
    comment: 'Комментарий к заказу',
  } 
};

const cls = {  
  container: {
    container: 'container',
    market: 'market',
    cart: 'cart',
    header: 'header',
    order: 'order',    
    address: 'address',
    comment: 'comment',
    content: 'content',
    button: 'button',
    col: 'col',
    product: 'product',
  },
  img:{
    wrapper: 'img_wrapper',
    img: 'img',    
  },
  text: {
    wrapper: 'text_wrapper',
    title: 'title',
    descr: 'descr',
  },
  price: {
    wrapper: 'price_wrapper',
    item: 'price_item',
    value: 'price_value',
    currency: 'price_currency'
  },
  btn: 'btn',
  hide: 'hide',
  input: 'input',   
};

const main = { 
  cart,
  products,
  dict,
  cls,
  containerElement: document.querySelector('div'),
  order: {
    total: 0, 
    quantity: 0,
    address: '',
    comment: '',
    cart
  },
  step: 0,

  init(){     
    this.containerElement.classList.add(this.cls.container.container);
    this.initMarket();
    this.initHeader();
    this.initCart();
  },

  initMarket(){ 
    const market_div = document.createElement('div');
    const market = this.cls.container.market;
    market_div.classList.add(market);
    market_div.innerHTML = this.createContentMarket(this.products, this.dict.order); 
    this.containerElement.appendChild(market_div);

    this.eventClick(`.${market}`, this.cartAddProduct.bind(this));
  }, 
  
  initHeader(){ 
    const header_div = document.createElement('div');
    header_div.classList.add(this.cls.container.header);
    header_div.innerHTML = this.createHeader(); 
    this.containerElement.appendChild(header_div);      
  },  

  initCart(){ 
    const cart_div = document.createElement('div');
    cart_div.classList.add(this.cls.container.cart);    
    cart_div.innerHTML = this.createContentCart(); 
    this.containerElement.appendChild(cart_div);

    const cart_product = `.${this.cls.container.cart} .${this.cls.container.product}`;
    const cart_button = `.${this.cls.container.cart} .${this.cls.container.button}`;

    this.eventClick(cart_product, this.cartDelProduct.bind(this));
    this.eventClick(cart_button, this.nextButton.bind(this));
  },

  cartAddProduct(e){      
    if(e.target.tagName !== 'BUTTON') return; 

    const product = this.pushProductCart(e);
    const cart_product = `.${this.cls.container.cart} .${this.cls.container.product}`;
    const cart_order = `.${this.cls.container.cart} .${this.cls.container.order}`;
    const header_title = `.${this.cls.container.header} .${this.cls.text.title}`;
    const cart_button = `.${this.cls.container.cart} .${this.cls.container.button}`;

    this.addItems(cart_product, this.content(product, this.dict.del));
    this.updateItems(cart_order, this.createOrder(this.order));
    this.updateItems(header_title, this.dict.your_order);
    this.removeClass(cart_button, this.cls.hide);
  },

  cartDelProduct(e){
    if(e.target.tagName !== 'BUTTON') return;     
    this.deleteProductCart(e);

    const cart_order = `.${this.cls.container.cart} .${this.cls.container.order}`;

    this.updateItems(cart_order, this.createOrder(this.order));

    if(this.cart.length == 0){ 
      this.removeItems(`.${this.cls.container.header}`);
      this.removeItems(`.${this.cls.container.cart}`);      
      this.initHeader();
      this.initCart();
    }
  },

  deleteProductCart(e){
    const cart_product = `.${this.cls.container.cart} .${this.cls.container.product}`;
    const cart_product_col = `.${this.cls.container.cart} .${this.cls.container.product} .${this.cls.container.col}`;
    const idx = this.getIdx(e, cart_product);
    const product = this.cart[idx];
    
    this.order.total -= product.price;
    this.order.quantity -= 1; 
    this.removeItems(cart_product_col, idx);
    this.cart.splice(idx, 1);
  },  

  pushProductCart(e){
    const market_product = `.${this.cls.container.market} .${this.cls.container.product}`;
    const idx = this.getIdx(e, market_product);    
    const product = this.products[idx];

    this.cart.push(product);
    this.order.total += product.price;
    this.order.quantity += 1;

    return product;
  }, 

  nextButton(e){
    if(e.target.tagName !== 'BUTTON') return; 
    this.step++;

    const cart = `.${this.cls.container.cart}`;
    const cart_product = `.${this.cls.container.cart} .${this.cls.container.product}`;
    const cart_address = `.${this.cls.container.cart} .${this.cls.container.address}`;
    const cart_comment = `.${this.cls.container.cart} .${this.cls.container.comment}`;
    const header_title = `.${this.cls.container.header} .${this.cls.text.title}`;

    if(this.step == 1) return this.firstStep(cart_product, cart_address, header_title);
    if(this.step == 2) return this.secondStep(cart_address, cart_comment, header_title); 
    if(this.step == 3) return this.thirdStep(cart, header_title);  
  }, 

  firstStep(cart_product, cart_address, header_title){    
    this.addClass(cart_product, this.cls.hide);
    this.removeClass(cart_address, this.cls.hide);
    this.updateItems(header_title, this.dict.address);    
  },

  secondStep(cart_address, cart_comment, header_title){
    const address = this.cls.container.address;
    this.order.address = this.getInputValue(address);   
    this.addClass(cart_address, this.cls.hide);
    this.removeClass(cart_comment, this.cls.hide);
    this.updateItems(header_title, this.dict.comment);
  },

  thirdStep(cart, header_title){
    const comment = this.cls.container.comment;
    this.order.comment = this.getInputValue(comment);    
    this.removeItems(cart);
    this.initCart();
    this.updateItems(header_title, this.dict.cart_null);
    
    console.log(this.order);

    //this.cart.splice(0, this.cart.length)
    this.cart.length = 0;
    this.step = 0;
    this.order.quantity = 0;
    this.order.total = 0;
    this.order.comment = '';
    this.order.address = '';
  },
  
  createContentMarket(product, btn_dict){
    let c = '';   
    c += '<div class="'+this.cls.container.product+'">';   
    product.forEach(function(el){
      c += main.content(el, btn_dict);
    });    
    c += '</div>';     
    return c;
  },

  createContentCart(){
    let c = '';   
    c += '<div class="'+this.cls.container.product+'"></div>';
    c += this.createInput(this.cls.container.address, this.dict.placeholder.address);
    c += this.createInput(this.cls.container.comment, this.dict.placeholder.comment);
    c += '<div class="'+this.cls.container.order+'"></div>';
    c += this.createButtonNext();    
    return c;
  },

  createInput(cls, placeholder){
    let c = '';
    c += '<div class="'+cls+' '+this.cls.hide+'">';
    c += '<div class="'+this.cls.container.col+'">';    
    c+= '<input type="text" class="'+this.cls.input+'" name="'+cls+'"  value="" placeholder="'+placeholder+'">';
    c += '</div>'; 
    c += '</div>'; 
    return c;
  },

  createButtonNext(){
    let c = '';
    c += '<div class="'+this.cls.container.button+' '+this.cls.hide+'">';
    c += '<div class="'+this.cls.container.col+'">';
    c += this.createButton(this.cls.btn, this.dict.next);
    c += '</div>'; 
    c += '</div>'; 
    return c;
  },

  createHeader(){
    let c = '';
    c += '<div class="'+this.cls.container.col+'">';
    c += '<div class='+this.cls.text.title+'>'+this.dict.cart_null+'</div>';        
    c += '</div>';
    return c;
  },

  createOrder(order){
    let c = '';
    c += '<div class="'+this.cls.container.col+'">';
    c += '<div class='+this.cls.text.descr+'>'+this.dict.total+': '+this.createPrice(order.quantity, this.dict.unit)+'</div>';
    c += '<div class='+this.cls.text.descr+'>'+this.dict.amount+': '+this.createPrice(order.total, this.dict.currency)+'</div>';    
    c += '</div>';
    return c;
  },

  content(el, btn_dict){
    let c = '';
    c += '<div class="'+this.cls.container.col+'">';
    c += '<div class="'+this.cls.container.content+'">'; 
    c += this.createImgMarket(el);
    c += this.createTextMarket(el);
    c += '</div>'; 
    c += this.createButton(this.cls.btn, btn_dict);
    c += '</div>';
    return c;
  },

  createButton(cls, btn_dict){
    return '<button class='+cls+'>'+btn_dict+'</button>';
  },

  createImgMarket(el){
    let c = '';
    c += '<div class='+this.cls.img.wrapper+'>';             
    c += '<div class='+this.cls.img.img+' style="background-image:url(img/'+el.img+');"></div>'; 
    c += '</div>'; 
    return c;
  },

  createTextMarket(el){
    let c = '';
    c += '<div class='+this.cls.text.wrapper+'>'; 
    c += '<div class='+this.cls.text.title+'>'+el.title+'</div>'; 
    c += '<div class='+this.cls.text.descr+'>'+el.description+'</div>'; 
    c += this.createPrice(el.price, el.currency);     
    c += '</div>';
    return c;
  },

  createPrice(price, currency){
    let c = '';      
    c += '<span class='+this.cls.price.item+'>'; 
    c += '<span class='+this.cls.price.value+'>'+price+'</span>'; 
    c += '<span class='+this.cls.price.currency+'>'+currency+'</span>'; 
    c += '</span>';
    return c;
  },

  addItems(cls, item){
    document.querySelector(cls).innerHTML += item;
  },

  removeItems(cls, idx=0){
    document.querySelectorAll(cls)[idx].remove();
  },

  updateItems(cls, item){
    document.querySelector(cls).innerHTML = item;
  },

  removeClass(cls, r_cls){
    document.querySelector(cls).classList.remove(r_cls);
  },

  addClass(cls, a_cls){
    document.querySelector(cls).classList.add(a_cls);
  },

  eventClick(cls, func){
    document.querySelector(cls).addEventListener('click', func);
  },

  getIdx(e, cls){
    const element = document.querySelector(cls);
    return [...element.children].indexOf(e.target.parentNode);
  },

  getInputValue(name){
    return document.getElementsByName(name)[0].value;
  },
}

main.init();