const Bundle = require('../Model/Bundle');

module.exports = {
    async store(req, res){
        const bundle = await Bundle.create({
            ...req.body,
            owner: req.user._id
        })
        return res.send({bundle});
    }
}