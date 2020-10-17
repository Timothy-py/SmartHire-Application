var Goaldetail = require("../models/goaldetail");
var models = require("../models");


// Endpoint for adding/creating goal details for a Goal
exports.GoalAddGoaldetail = async (req, res, next) => {


    if(isNaN(req.params.goal_id)!=true){
        // first find the goal obj about to be created a goaldetail for
        const goal = await models.Goal.findByPk(req.params.goal_id);
        
        // if not found
        if(!goal){
            console.log("Cannot find the Goal you want to add a goaldetail to");
            return res.status(422).json({ status: false,  error: 'Cannot find that Goal you want to add a Goaldetail to'});
        
        // if found
        }else{
            // create goal detail for the goal
            models.Goaldetail.create({
                detail: req.body.detail,
                GoalId: req.params.goal_id
            })
            .then((goaldetail) => {
                res.json({
                    message: `Goaldetail Created Successfully for ${goal.goalName}`,
                    data: goaldetail,
                    status: true
                })
            })
            .catch((error) =>{
                console.log("There was an error creating Goaldetail for the Goal: " + error)
                res.json({
                    message: `There was an error creating Goaldetail for the Goal: ${error}`,
                    status: false
                })
            })
        }
        
    }else{
        idError2(req, res)
    }

};


// Handle Goaldetail Delete on GET request
exports.getGoaldetailDelete = async function(req, res, next) {
    
    if (isNaN(req.params.goaldetail_id)!=true){
        const goaldetail = await models.Goaldetail.findByPk(req.params.goaldetail_id)
        
        if(!goaldetail){
            console.log("Cannot find the goaldetail that you wish to delete");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that goaldetail that you wish to delete'});
        }else{
            models.Goaldetail.destroy({
            where: {
              id: req.params.goaldetail_id
            }
          })
            .then(function() {
                
                res.json({
                    message: 'Goaldetail Deleted Successfully',
                    status: true
                });
                console.log("Goaldetail deleted successfully");
                
            })
            .catch((error) => {
                
                console.log("There was an error deleting the Goaldetail " + error);
                res.json({
                    message: `There was an error deleting the goaldetail: ${error}`,
                    status: false
                })
            })
        }
    }else{
        idError(req, res)
    }
    
};


// Handle Goaldetail Update on POST request
exports.postGoaldetailUpdate =  async (req, res, next) => {

    if(isNaN(req.params.goaldetail_id && req.params.goal_id)!=true){
        const goaldetail = await models.Goaldetail.findByPk(req.params.goaldetail_id)
        const goal = await models.Goal.findByPk(req.params.goal_id)
        
        if(!(goaldetail && goal)){
            console.log("Cannot find the goaldetail selected for update");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that goaldetail selected for update'});
        }else{
            models.Goaldetail.update({
            detail: req.body.detail,
            GoalId: req.params.goal_id,
            status: req.body.status
        },{
            where: {id: req.params.goaldetail_id}
        })
        .then((goaldetail) => {
            
            res.json({
                message: `Goaldetail with id ${req.params.goaldetail_id} was updated successfully`,
                data: goaldetail,
                status: true
            })
            
        })
        .catch((error) => {
            
            console.log("There was an error updating the goaldetail: " + error);
            res.json({
                message: `There was an error updating the goaldetail: ${error}`,
                status: false
            })
        })
        }
        
    }else{
        idError(req, res)
    }

};



// Post Action to change the status of a goaldetail
exports.GoaldetailChangeStatus = async function(req, res, next) {
    
    // all detail ids to be updated to done--coming from the FE
    let details = req.body.details
    
    // convert the all details id to int
    var int_details = []
    if(typeof(details)=='string'){
        int_details.push(parseInt(details))
    }else if(typeof(details)=='object'){
        details.forEach((detail)=>{int_details.push(parseInt(detail))})
    }else{
        
        await models.Goaldetail.update({
                status: 'undone'
            },{
                where: {GoalId: req.params.goal_id}
            })
            console.log(`DETAILS WITH GOALID ${req.params.goal_id} UPDATED TO UNDONE SUCCESSFULLY`)
    }
    
    console.log(`THESE ARE THE DETAILS(ids) TO BE UPDATED TO DONE ${int_details}`)
    
    
    // find all other details with thesame GOALID
    let all_details = await models.Goaldetail.findAll({
        where: {GoalId: req.params.goal_id}
    })
    
    // iteratively push all the ids to this array
    let all_details_id = []
    await all_details.forEach(async(detail) =>{
        all_details_id.push(detail.id)
    })
    console.log(`ALL DETAILS id ${all_details_id}`)
    
    
    try {

        if(int_details){
            console.log(`DETAILS ID LENGTH ${int_details.length}`)
            // iteratively update done details
            for (let index = 0; index < int_details.length; index++) { 
                
            models.Goaldetail.update({
                status: 'done'
            }, {
                where: {id: int_details[index]}
            })
             console.log(`DETAILS OF ID ${int_details[index]} UPDATED TO DONE SUCCESSFULLY`)
            } 
        }
        
    }catch(error){
        console.log("There was an error updating status of the goaldetails: " + error);
        res.json({
            message: `There was an error updating status of the goaldetails: ${error}`,
            status: false
        })
        
    }finally{
        
        if(int_details){
        // store all detail ids that are not included in the body here i.e undone details
        var undone_details = all_details_id.filter( (el) => !int_details.includes(el))
        console.log(`DETAILS TO BE UPDATED TO UNDONE ${undone_details}`)
        
        // iteratively update undone details
        if(undone_details.length > 0){
            await undone_details.forEach(async(detail) =>{
                await models.Goaldetail.update({
                    status: 'undone'
                }, {
                    where: {id: detail}
                })
                
                console.log(`DETAILS OF ID ${detail} UPDATED TO UNDONE SUCCESSFULLY`)
            })
        }
        }
    }
    
    // RESPONSE
    res.json({
        message: `The Statuses of the Goal were updated successfully`,
        status: true
    })
    
};


// Display a Goaldetail Detail on GET request
exports.getGoaldetailDetails = async function(req, res, next) {
    
    if(isNaN(req.params.goaldetail_id)!=true){
        const goaldetail = await models.Goaldetail.findByPk(req.params.goaldetail_id)

        if(!goaldetail){
            
            console.log("Cannot find the goaldetail selected for detail");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that goaldetail selected for details'});
            
        }else{
            models.Goaldetail.findByPk(req.params.goaldetail_id, {
                
            include: [{
                model: models.Goal,
                as: 'goal',
                attributes: ['id', 'goalName']
            }]
            
            })
            .then(function(goaldetail){
                
                res.json({
                    message: `This is the detail of the goaldetail with ID ${req.params.goaldetail_id}`,
                    data: goaldetail,
                    status: true
                })
                console.log("GOaldetail Details retrieved successfully");
                
            })
            .catch((error)=>{
                
                console.log("There was an error retrieving the goaldetail details: "+ error);
                res.json({
                    message: `There was an error retrieving the goaldetail details: ${error}`,
                    status: false
                })
            })
        }
    }else{
        idError(req, res)
    }
    
};



// GET request to get all Goal details associated to a particular Goal
exports.getGoalGoaldetails = async function(req, res, next) {
    
    if(isNaN(req.params.goal_id)!=true){
        // first retrieve the goal obj of the goal you want to find its goaldetails
        const goal = await models.Goal.findByPk(req.params.goal_id);
        
        // if not found
        if(!goal){
            console.log("Cannot find the Goal you want to add a goaldetail to");
            return res.status(422).json({ status: false,  error: 'Cannot find that Goal you want to add a Goaldetail to'});
        // if found
        }else{
            // find all the goaldetails that have the goal id
             await models.Goaldetail.findAll({
                 where: {
                     GoalId: goal.id
                 }
             })
             .then((goaldetails)=>{
                res.json({
                    message: `THESE ARE THE DETAILS FOR GOAL: ${goal.goalName}`,
                    data: goaldetails,
                    status: true
                }) 
             })
             .catch((error)=>{
                console.log("There was an error listing all goaldetails: " + error);
                res.json({
                    message: `There was an error retrieving all goaldetails: ${error}`,
                    status: false
                }) 
             })
        }
            
    }else{
        idError2(req, res)
    }
};



// Display all Goaldetails on GET request
exports.getGoaldetailList = function(req, res, next) {
    
    models.Goaldetail.findAll({
       include: [{
           model: models.Goal,
           as: 'goal',
           attributes: ['id', 'goalName']
       }]
   })
   .then(function(goaldetails){
       
       res.json({
           message: "Here is the list of all goaldetails",
           data: goaldetails,
           status: true
       })
       console.log("Goaldetail List rendered successfully");
       
   })
   .catch((error) => {
       
       console.log("There was an error listing all goaldetails: " + error);
       res.json({
           message: `There was an error retrieving all goaldetails: ${error}`,
           status: false
       })
       
   })
   
};


// asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Goaldetail id ${req.params.goaldetail_id} passed is not an integer`);
    res.json({
        message: `This Goaldetail id ${req.params.goaldetail_id} passed is not an integer`,
        status: false
    })
}

async function idError2(req, res) {
    console.log(`The Goal id ${req.params.goal_id} passed is not an integer`);
    res.json({
        message: `This Goal id ${req.params.goal_id} passed is not an integer`,
        status: false
    })
}