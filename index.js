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
    const order = orders.filter(o => o.customerId === customerId);
    if(order) {
        res.send(order);
    } else {
        res.status(404).send({error:'Orders not found'})
    }

})
app.listen(8080, () => {
    console.log('Server is running!');
});