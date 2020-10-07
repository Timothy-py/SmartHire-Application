var models = require('../models');


// Endpoint for creating a Currentbusiness
exports.postCurrentbusinessCreate = async (req, res, next)=>{

    await models.CurrentBusiness.create({
        current_business_name: req.body.currentbusinessName
    })
    .then((currentbusiness)=>{
        
        res.json({
            message: "Currentbusiness Created successfully",
            data: currentbusiness,
            status: true
        })
        console.log("Currentbusiness created successfully")
    })
    .catch((error)=>{

        console.log("There was an error creating the Currentbusiness: " + error);
        res.json({
            message: `There was an error creating the Currentbusiness: ${error}`,
            status: false
        })

    })

};


// Handle Currentbusiness Delete on GET Request
exports.getCurrentbusinessDelete = async function(req, res, next) {
    
    if(isNaN(req.params.currentbusiness_id)!=true){
        
        const currentbusiness = await models.CurrentBusiness.findByPk(req.params.currentbusiness_id);
        
        if(!currentbusiness){
            console.log("Cannot find that currentbusiness that you want to delete")
            return res.status(400).json({status: false, error: "Cannot find that Currentbusiness that you want to delete"});
        }else{
            models.CurrentBusiness.destroy({
                where: {id: req.params.currentbusiness_id}
            })
            .then(()=>{

                res.json({
                    message: "Currentbusiness Deleted Successfully",
                    status: true
                });
                console.log('Currentbusiness deleted successfully');
            })
            .catch(error => {
                console.log("There was an error deleting the Currentbusiness: " + error);
                res.json({
                    message: `There was an error deleting the currentbusiness: ${error}`,
                    status: false
                })
            })
        }
        
    }else{
        idError(req, res)
    }
    
};


// Handle Currentbusiness Update on POST request
exports.postCurrentbusinessUpdate = async (req, res, next)=>{

    if(isNaN(req.params.currentbusiness_id)!=true){
        const currentbusiness = await models.CurrentBusiness.findByPk(req.params.currentbusiness_id);
    
        if(!currentbusiness){
            console.log("Cannot find the currentbusiness selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that currentbusiness selected'});
        } else {

            try{
                
                models.CurrentBusiness.update({
                current_business_name: req.body.currentbusinessName
                }, {
                    where: {id: req.params.currentbusiness_id}
                })
                
                res.json({
                        message: `Currentbusiness with id ${req.params.currentbusiness_id} was updated successfully`,
                        data: currentbusiness,
                        status: true
                    })
                
            } catch (error){
                console.log('There was an error updating the Currentbusiness: ' + error);
                res.json({
                    message: `There was an error updating the currentbusiness: ${error}`,
                    status: false
                })
            }
        }
        
    }else{
        idError(req, res)
    }

};


// Display a Currentbusiness Detail on GET request
exports.getCurrentbusinessDetails = async function(req, res, next) {
    
    if(isNaN(req.params.currentbusiness_id)!=true){
        const currentbusiness = await models.CurrentBusiness.findByPk(req.params.currentbusiness_id)
        
        if(!currentbusiness){
            console.log("Cannot find the currentbusiness selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that currentbusiness selected'});
            
        } else {
            
            models.CurrentBusiness.findByPk(req.params.currentbusiness_id, {
            include: [
            {
                model: models.User,
                as: 'members',
                attributes: ['id', 'username']
            }]
            })
            .then(function(currentbusiness){
                
                res.json({
                    message: `This is the detail of the currentbusiness with ID ${currentbusiness.id}`,
                    data: currentbusiness,
                    status: true});
                console.log("Currentbusiness details retrieved successfully");
            
            })
            .catch((error) => {
                
                console.log("There was an error retrieving the currentbusiness details: " + error);
                res.json({
                    message: `There was an error retrieving the currentbusiness details: ${error}`,
                    status: false
                })
                
            })
            }
        
    }else{
        idError(req, res)
    }
};


// Display all Currentbusinesss on GET request
exports.getCurrentbusinessList = function(req, res, next) {
    
    models.CurrentBusiness.findAll({
        include: [
        {
            model: models.User,
            as: 'members',
            attributes: ['id', 'username']
        }]
    })
    .then(function(currentbusinesss){
        
        res.json({
            message: "Here is the list of all Currentbusinesss",
            data: currentbusinesss,
            status: true
        })
        console.log("Currentbusiness List rendered successfully");
        
    })
    .catch((error) => {
        
        console.log("There was an error listing all currentbusinesss: " + error);
        res.json({
            message: `There was an error retrieving all currentbusinesss: ${error}`,
            status: false
        })
        
    })
    
};



// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Currentbusiness id ${req.params.currentbusiness_id} passed is not an integer`);
    res.json({
        message: `This Currentbusiness id ${req.params.currentbusiness_id} passed is not an integer`,
        status: false
    })
}