const CustomerModel = require('../Models/Customer.js');

class CustomerController {
    async getAllCustomers(req,res){
        try {
            const customers = await CustomerModel.find();
            res.status(200).json(customers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCustomerByLineId(req, res) {
        const { lineId } = req.params;
        try {
            const customer = await CustomerModel.findOne({ customerLineId: lineId });
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.status(200).json(customer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = CustomerController;