const Bundle = require('../Model/Bundle');

module.exports = {
    async store(req, res){
        try {
            const bundle = await Bundle.create({
                ...req.body,
                owner: req.user._id
            })
            return res.send({bundle});
        } catch(error){
            return res.send({error: error.message});
        }
    },
    async index(req, res){
        console.log(req.query);
        try {
            let bundles = [];
            if(req.query.category === 'active'){
                bundles = await Bundle.find({owner: req.user._id, active: true});
            } else if(req.query.category === 'inactive'){
                bundles = await Bundle.find({owner: req.user.id, active: false});
            }
            return res.send({bundles});
        } catch(error){
            return res.send({error: error.message});
        }
    },
    async delete(req, res){
        try {
            await Bundle.findByIdAndDelete(req.params.id);
            return res.sendStatus(200);
        } catch(error){
            return res.send({error: error.message});
        }
    },
    async update(req, res){
        try {
            const bundle = await Bundle.findById(req.paramas.id);
            const keys = Object.keys(bundle);
            keys.forEach((key) => bundle[key] = req.body[key]);
            await bundle.save();
            return res.send({bundle});
        } catch(error){
            return res.send({error: error.message});
        }
    }
}