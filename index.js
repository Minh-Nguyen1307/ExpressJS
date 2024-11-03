import express from 'express';
const app = express();
import { customers, orders, products  } from './dat.js';
app.get('/customers', (req, res) => {
    
    res.send(customers);});
app.get('/customers/:id',(req,res)=>{
    const {id} = req.params;
    const customer = customers.find(i => i.id === id);
    if(customer) {
        res.send(customer);
    }
    else {
        res.status(404).send({error:'Customer not found'})
    }
})
app.get('/customers/:customerId/orders' ,(req,res) =>{
    const {customerId} = req.params;
    const customerOrder = orders.filter(o => o.customerId === customerId);
    if(customerOrder) {
        res.send(customerOrder);
    } else {
        res.status(404).send({error:'Orders not found'})
    }

})
app.get('/orders/highvalue', (req,res) => {
    const ordersHighvalue = orders.filter(p => p.totalPrice >10000000)
    if(ordersHighvalue.length >0) {
        res.send(ordersHighvalue)
    } else {
        res.status(404).send({error:'Orders not found'})
    }
})

app.get('/products', (req, res) => {
    
})
app.get('*', (req,res) => {
    res.send('Not support!')
})
app.listen(8080, () => {
    console.log('Server is running!');
});