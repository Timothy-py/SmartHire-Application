var models = require('../models');


// Endpoint for creating a Department
exports.postDepartmentCreate = async (req, res, next)=>{

    await models.Department.create({
        department_name: req.body.departmentName
    })
    .then((department)=>{
        
        res.json({
            message: "Department Created successfully",
            data: department,
            status: true
        })
        console.log("Department created successfully")
    })
    .catch((error)=>{

        console.log("There was an error creating the Department: " + error);
        res.json({
            message: `There was an error creating the Department: ${error}`,
            status: false
        })

    })

};


// Handle Department Delete on GET Request
exports.getDepartmentDelete = async function(req, res, next) {
    
    if(isNaN(req.params.department_id)!=true){
        
        const department = await models.Department.findByPk(req.params.department_id);
        
        if(!department){
            console.log("Cannot find that department that you want to delete")
            return res.status(400).json({status: false, error: "Cannot find that Department that you want to delete"});
        }else{
            models.Department.destroy({
                where: {id: req.params.department_id}
            })
            .then(()=>{
                res.json({
                    message: "Department Deleted Successfully",
                    status: true
                });
                console.log('Department deleted successfully');
            })
            .catch(error => {
                console.log("There was an error deleting the Department: " + error);
                res.json({
                    message: `There was an error deleting the department: ${error}`,
                    status: false
                })
            })
        }
        
    }else{
        idError(req, res)
    }
    
};


// Handle Department Update on POST request
exports.postDepartmentUpdate = async (req, res, next)=>{

    if(isNaN(req.params.department_id)!=true){
        const department = await models.Department.findByPk(req.params.department_id);
    
        if(!department){
            console.log("Cannot find the department selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that department selected'});
        } else {

            try{
                
                models.Department.update({
                department_name: req.body.departmentName
                }, {
                    where: {id: req.params.department_id}
                })
                
                res.json({
                        message: `Department with id ${req.params.department_id} was updated successfully`,
                        data: department,
                        status: true
                    })
                
            } catch (error){
                console.log('There was an error updating the Department: ' + error);
                res.json({
                    message: `There was an error updating the department: ${error}`,
                    status: false
                })
            }
        }
        
    }else{
        idError(req, res)
    }

};


// Display a Department Detail on GET request
exports.getDepartmentDetails = async function(req, res, next) {
    
    if(isNaN(req.params.department_id)!=true){
        const department = await models.Department.findByPk(req.params.department_id)
        
        if(!department){
            console.log("Cannot find the department selected");
            return res.status(422).json({ status: false,  error: 'Cannot find that department selected'});
            
        } else {
            
            models.Department.findByPk(req.params.department_id, {
            include: [
            {
                model: models.User,
                as: 'members',
                attributes: ['id', 'username']
            }]
            })
            .then(function(department){
                
                res.json({
                    message: `This is the detail of the department with ID ${department.id}`,
                    data: department,
                    status: true});
                console.log("Department details retrieved successfully");
            
            })
            .catch((error) => {
                
                console.log("There was an error retrieving the department details: " + error);
                res.json({
                    message: `There was an error retrieving the department details: ${error}`,
                    status: false
                })
                
            })
            }
        
    }else{
        idError(req, res)
    }
};


// Display all Departments on GET request
exports.getDepartmentList = function(req, res, next) {
    
    models.Department.findAll({
        include: [
        {
            model: models.User,
            as: 'members',
            attributes: ['id', 'username']
        }]
    })
    .then(function(departments){
        
        res.json({
            message: "Here is the list of all Departments",
            data: departments,
            status: true
        })
        console.log("Department List rendered successfully");
        
    })
    .catch((error) => {
        
        console.log("There was an error listing all departments: " + error);
        res.json({
            message: `There was an error retrieving all departments: ${error}`,
            status: false
        })
        
    })
    
};



// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Department id ${req.params.department_id} passed is not an integer`);
    res.json({
        message: `This Department id ${req.params.department_id} passed is not an integer`,
        status: false
    })
}