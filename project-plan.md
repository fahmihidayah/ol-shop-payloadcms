
- Pages  
1. home page the path is / 
2. products page the path is /products
3. products detail page the path is /products/{slug}
4. cart page is /cart
5. checkout page is /checkout
6. account area page 
  6.1 account dashboard /account
  6.2 account profile /account/profile 
  6.2 orders /account/orders
  6.3 withlist /account/wishlist
  6.4 address /account/addresses
7. login page is /login
8. register page is /register
9. forgot password page is /forgot-password

- Basic Code Pattern
the features is should placed on modules 
each module should have 
1.components, that contain small component, like product_item.tsx, 
login-form.tsx, 
2. templates, that contain representation of the page, and have query to database.
the query should use actions functions that already definied.
3. actions, that contain list of async function that query to database. 
It should use payload config to query. The pattern is, the function is async 
then they receive parameters like this {param, param} : {param : typedata, param: typedata...}
then in the body get payload config, const payload = await getPayload({payloadConfig})
then next it will be queries to the database using payload method, find, create, delete, etc.

- Form submission code pattern 
form should use zod as validation.
form should use useForm hook 
the form component should use components/ui/form.tsx

- Client side request code pattern
if you use client side request, use react query. 
then place it into separate hooks, to make code more clean. 

- Detail of features
1. Home page 

2. Products page
  1. contain list of products in grid 4, each item of product should have 
  image, product name, price and button add to cart.
  2. 
  2. the top there are list of categories, that will be filter the product.
  3. use react query to query the product. 
  4. inside react query use action that definied on the module, the action call getProducts
3. Products Detail page 

4. Login page
  1. 
5. Register page 
6. Cart page
7. Checkout page
8. Account page 
  8.1 Account Dashboard page
  8.2 Account Wishlist page
  8.3 Account Orders page
  8.4 Account Address page
  8.5 Account Profile page
  8.6 Account Change Password page
9. Forgot Password page   
