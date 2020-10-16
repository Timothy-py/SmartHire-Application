var Skillpool = require('../models/skillpool');
var models = require('../models');


// endpoint for creating a skillpool for a department
exports.postSkillpoolCreate = async (req, res, next)=>{

    console.log(`User ID ${req.user.id}`);
    console.log(`Department ID ${req.user.DepartmentId}`);
    console.log(`Current Business ID ${req.user.CurrentBusinessId}`)

    await models.Skillpool.create({
        skillpoolName: req.body.skillpoolName,
        DepartmentId: req.user.DepartmentId,
        CurrentBusinessId: req.user.CurrentBusinessId,
        UserId: req.user.id
    })
    .then((skillpool)=>{
        res.json({
            message: "Skillpool Created Successfully",
            data: skillpool,
            status: true
        })
        console.log("Skillpool created successfully")
    })
    .catch((error)=>{    
        console.log(`There was an error creating the Skillpool: ${error}`)
        res.json({
            message: `There was an error creating the Skillpool: ${error}`,
            status: false
        })
    })  

};


// Handle Skillpool Delete on GET request
exports.getSkillpoolDelete = async function(req, res, next) {
    
    if(isNaN(req.params.skillpool_id)!=true){
        
        const skillpool = await models.Skillpool.findByPk(req.params.skillpool_id);
        
        if(!skillpool){
            console.log("Cannot find that skillpool that you want to delete")
            return res.status(400).json({status: false, error: "Cannot find that Skillpool that you want to delete"});
        }else{
            models.Skillpool.destroy({
                where: {id: req.params.skillpool_id}
            })
            .then(()=>{
                res.json({
                    message: "Skillpool Deleted Successfully",
                    status: true
                });
                console.log('Skillpool deleted successfully');
            })
            .catch(error => {
                console.log("There was an error deleting the Skillpool: " + error);
                res.json({
                    message: `There was an error deleting the skillpool: ${error}`,
                    status: false
                })
            })
        }
        
    }else{
        idError(req, res)
    }
    
};


// Handle Skillpool Update on POST request
exports.postSkillpoolUpdate = async (req, res, next)=>{

    if(isNaN(req.params.skillpool_id)!=true){
        const skillpool = await models.Skillpool.findByPk(req.params.skillpool_id);
    
        if(!skillpool){
            console.log("Cannot find the skillpool selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that skillpool selected'});
        } else {

            try{
                
                models.Skillpool.update({
                skillpoolName: req.body.skillpoolName
                }, {
                    where: {id: req.params.skillpool_id}
                })
                
                res.json({
                        message: `Skillpool with id ${req.params.skillpool_id} was updated successfully`,
                        data: skillpool,
                        status: true
                    })
                
            } catch (error){
                console.log('There was an error updating the Skillpool: ' + error);
                res.json({
                    message: `There was an error updating the skillpool: ${error}`,
                    status: false
                })
            }
        }
        
    }else{
        idError(req, res)
    }

};



// Display a Skillpool Detail on GET request
exports.getSkillpoolDetails = async function(req, res, next) {
    
    if(isNaN(req.params.skillpool_id)!=true){
        const skillpool = await models.Skillpool.findByPk(req.params.skillpool_id)
        
        if(!skillpool){
            console.log("Cannot find the skillpool selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that skillpool selected'});
            
        } else {
            
            models.Skillpool.findByPk(req.params.skillpool_id, {
            include: [{
                model: models.Skill,
                as: 'skills',
                attributes: ['id', 'skillName'],
            },
            {
                model: models.User,
                as: 'manager',
                attributes: ['id', 'username']
            }]
            })
            .then(function(skillpool){
                
                res.json({
                    message: `This is the detail of the skillpool with ID ${skillpool.id}`,
                    data: skillpool,
                    status: true});
                console.log("Skillpool details retrieved successfully");
            
            })
            .catch((error) => {
                
                console.log("There was an error retrieving the skillpool details: " + error);
                res.json({
                    message: `There was an error retrieving the skillpool details: ${error}`,
                    status: false
                })
                
            })
            }
        
    }else{
        idError(req, res)
    }
};


// Display all Skillpools on GET request
exports.getSkillpoolList = async function(req, res, next) {
    
    await models.Skillpool.findAll({
        include: [
        {
            model: models.User,
            as: 'manager',
            attributes: ['id', 'username']
        }]
    })
    .then(function(skillpools){
        
        res.json({
            message: "Here is the list of all Skillpools",
            data: skillpools,
            status: true
        })
        console.log("Skillpool List rendered successfully");
        
    })
    .catch((error) => {
        
        console.log("There was an error listing all skillpools: " + error);
        res.json({
            message: `There was an error retrieving all skillpools: ${error}`,
            status: false
        })
        
    })
    
};



// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Skillpool id ${req.params.skillpool_id} passed is not an integer`);
    res.json({
        message: `This Skillpool id ${req.params.skillpool_id} passed is not an integer`,
        status: false
    })
}