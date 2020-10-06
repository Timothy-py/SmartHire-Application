var models = require('../models');


// Endpoint for creating a Role
exports.postRoleCreate = async (req, res, next)=>{

    await models.Role.create({
        role_name: req.body.roleName
    })
    .then((role)=>{
        
        res.json({
            message: "Role Created successfully",
            data: role,
            status: true
        })
        console.log("ROle created successfully")
    })
    .catch((error)=>{

        console.log("There was an error creating the Role: " + error);
        res.json({
            message: `There was an error creating the Role: ${error}`,
            status: false
        })

    })

};


// Handle ROle Delete on GET Request
exports.getRoleDelete = async function(req, res, next) {
    
    if(isNaN(req.params.role_id)!=true){
        
        const role = await models.Role.findByPk(req.params.role_id);
        
        if(!role){
            console.log("Cannot find that role that you want to delete")
            return res.status(400).json({status: false, error: "Cannot find that Role that you want to delete"});
        }else{
            models.Role.destroy({
                where: {id: req.params.role_id}
            })
            .then(()=>{
                res.json({
                    message: "Role Deleted Successfully",
                    status: true
                });
                console.log('Role deleted successfully');
            })
            .catch(error => {
                console.log("There was an error deleting the Role: " + error);
                res.json({
                    message: `There was an error deleting the role: ${error}`,
                    status: false
                })
            })
        }
        
    }else{
        idError(req, res)
    }
    
};


// Handle Role Update on POST request
exports.postRoleUpdate = async (req, res, next)=>{

    if(isNaN(req.params.role_id)!=true){
        const role = await models.Role.findByPk(req.params.role_id);
    
        if(!role){
            console.log("Cannot find the role selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that role selected'});
        } else {

            try{
                
                models.Role.update({
                role_name: req.body.roleName
                }, {
                    where: {id: req.params.role_id}
                })
                
                res.json({
                        message: `Role with id ${req.params.role_id} was updated successfully`,
                        data: role,
                        status: true
                    })
                
            } catch (error){
                console.log('There was an error updating the Role: ' + error);
                res.json({
                    message: `There was an error updating the role: ${error}`,
                    status: false
                })
            }
        }
        
    }else{
        idError(req, res)
    }

};


// Display a Role Detail on GET request
exports.getRoleDetails = async function(req, res, next) {
    
    if(isNaN(req.params.role_id)!=true){
        const role = await models.Role.findByPk(req.params.role_id)
        
        if(!role){
            console.log("Cannot find the role selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that role selected'});
            
        } else {
            
            models.Role.findByPk(req.params.role_id, {
            include: [
            {
                model: models.User,
                as: 'Users',
                attributes: ['id', 'username']
            }]
            })
            .then(function(role){
                
                res.json({
                    message: `This is the detail of the role with ID ${role.id}`,
                    data: role,
                    status: true});
                console.log("Role details retrieved successfully");
            
            })
            .catch((error) => {
                
                console.log("There was an error retrieving the role details: " + error);
                res.json({
                    message: `There was an error retrieving the role details: ${error}`,
                    status: false
                })
                
            })
            }
        
    }else{
        idError(req, res)
    }
};


// Display all Roles on GET request
exports.getRoleList = function(req, res, next) {
    
    models.Role.findAll({
        include: [
        {
            model: models.User,
            as: 'Users',
            attributes: ['id', 'username']
        }]
    })
    .then(function(roles){
        
        res.json({
            message: "Here is the list of all Roles",
            data: roles,
            status: true
        })
        console.log("Role List rendered successfully");
        
    })
    .catch((error) => {
        
        console.log("There was an error listing all roles: " + error);
        res.json({
            message: `There was an error retrieving all roles: ${error}`,
            status: false
        })
        
    })
    
};



// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Role id ${req.params.role_id} passed is not an integer`);
    res.json({
        message: `This Role id ${req.params.role_id} passed is not an integer`,
        status: false
    })
}