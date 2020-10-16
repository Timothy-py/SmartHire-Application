var Goal = require("../models/goal");
var models = require("../models");



// Handle Goal Create on POST request
exports.postGoalCreate = async (req, res, next) => {

    await models.Goal.create({
        goalName: req.body.goalName,
        target_date: req.body.target_date,
        UserId: req.user.id
    })
    .then((goal)=>{
        
        res.json({
            message: 'Goal created successfully',
            data: goal,
            status: true
        })
        console.log("Goal created successfuly")
    })
    .catch((error)=>{
        res.json({
            message: `There was an error creating the goal: ${error}`,
            status: false
        })
        console.log(`There was an error creating the goal: ${error}`)
    })

};


// Handle Goal Delete on GET request
exports.getGoalDelete = async function(req, res, next) {
   
    if (isNaN(req.params.goal_id)!=true){
         const goal = await models.Goal.findByPk(req.params.goal_id)
         
         if(!goal){
             console.log("Cannot find the goal that you wish to delete");
             return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that goal that you wish to delete'});
         }else{
             models.Goal.destroy({
             where: {
               id: req.params.goal_id
             }
           })
             .then(function() {
                 
                 res.json({
                     message: 'Goal Deleted Successfully',
                     status: true
                 });
                 console.log("Goal deleted successfully");
                 
             })
             .catch((error) => {
                 
                 console.log("There was an error deleting the Goal " + error);
                 res.json({
                     message: `There was an error deleting the goal: ${error}`,
                     status: false
                 })
             })
         }
     }else{
         idError(req, res)
     }
    
 };


// Handle Goal Update on POST request
exports.postGoalUpdate = async (req, res, next) => {

    console.log("THESE ARE THE DATA")
    console.log(req.body.goalName)
    console.log(req.body.target_date)
    console.log(req.params.goal_id)
    
    if(isNaN(req.params.goal_id)!=true){
        const goal = await models.Goal.findByPk(req.params.goal_id)
        
        if(!goal){
            console.log("Cannot find the goal selected for update");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that goal selected for update'});
        }else{
            models.Goal.update({
            goalName: req.body.goalName,
            target_date: req.body.target_date
        },{
            where: {id: req.params.goal_id}
        })
        .then((goal) => {
            
            res.json({
                message: `Goal with id ${req.params.goal_id} was updated successfully`,
                data: goal,
                status: true
            })
            
        })
        .catch((error) => {
            
            console.log("There was an error updating the goal: " + error);
            res.json({
                message: `There was an error updating the goal: ${error}`,
                status: false
            })
        })
        }
        
    }else{
        idError(req, res)
    }

};


// Display a Goal Detail on GET request
exports.getGoalDetails = async function(req, res, next) {
    
    if(isNaN(req.params.goal_id)!=true){
        const goal = await models.Goal.findByPk(req.params.goal_id)

        if(!goal){
            
            console.log("Cannot find the goal selected for detail");
            return res.status(422).json({ status: false,  error: 'ERROR! Cannot find that goal selected for details'});
            
        }else{
            let percent_complete = 0;
            
            let total_goal_targets = await models.Goaldetail.findAndCountAll({
                where: {GoalId: req.params.goal_id}
            })
            
            let done_goal_targets = await models.Goaldetail.findAndCountAll({
                where: {GoalId: req.params.goal_id, status: 'done'}
            })
            
            percent_complete = (done_goal_targets.count / total_goal_targets.count) * 100;
            
            await models.Goal.findByPk(req.params.goal_id, {
                
            include: [{
                model: models.User,
                as: 'user',
                attributes: ['id', 'username']
            }, {
                model: models.Goaldetail,
                as: 'goaldetail',
                attributes: ['id', 'detail', 'status']
            }]
            
            })
            .then(function(goal){
                
                res.json({
                    message: `This is the detail of the goal with ID ${req.params.goal_id}`,
                    percent_complete: percent_complete,
                    data: goal,
                    status: true
                })
                console.log("GOal Details retrieved successfully");
                
            })
            .catch((error)=>{
                
                console.log("There was an error retrieving the goal details: "+ error);
                res.json({
                    message: `There was an error retrieving the goal details: ${error}`,
                    status: false
                })
            })
        }
    }else{
        idError(req, res)
    }
};



// GET request to get all Goals for the Current LOgged in User
exports.getUserGoals = async function(req, res, next) {
             
    await models.Goal.findAll({
       where: {
           UserId: req.user.id
       }
    })
    .then((user_goals)=>{
       console.log(`THESE ARE THE GOALS FOR USER:${req.user.username}`);
       res.json({
           message: `THESE ARE THE GOALS FOR USER:${req.user.username}`,
           data: user_goals,
           status: true
       }) 
    })
    .catch((error)=>{
       console.log("There was an error listing all goals the User: " + error);
       res.json({
           message: `There was an error retrieving all goals by the User: ${error}`,
           status: false
       }) 
    })
       
};


// Display all Goals by Users in a Department and Current Business on GET request
exports.getGoalListByDepartment = async function(req, res, next) {
    
    let dept = await models.Department.findOne({
        where: {id: req.user.DepartmentId}
    });
    
    let cb = await models.CurrentBusiness.findOne({
        where: {id: req.user.CurrentBusinessId}
    });
    
    
    await models.Goal.findAll({
        include: [{
            model: models.User,
            where: {DepartmentId: req.user.DepartmentId, CurrentBusinessId: req.user.CurrentBusinessId},
            as: 'user',
            attributes: ['id', 'username']
        },{
            model: models.Goaldetail,
            as: 'goaldetail',
            attributes: ['id', 'detail', 'status']
        }]
    })
    .then(function(goals){
        if(goals.length > 0){
            res.json({
            message: "Here is the list of all goals created by users in this department and current_business",
            dept_name: dept.department_name,
            cb: cb.current_business_name,
            data: goals,
            status: true
        })
        }else{
            res.json({
            message: "There are no goals created by users in this department and current_business",
            dept_name: dept.department_name,
            cd: cb.current_business_name,
            data: ['no goal'],
            status: true
        })
        }
        console.log("Goal List rendered successfully");
    })
    .catch((error) => {
        console.log("There was an error listing all goals: " + error);
        res.json({
            message: `There was an error retrieving all goals: ${error}`,
            status: false
        })
    })
    
};


// Display all Goals on GET request
exports.getGoalList = function(req, res, next) {
    
    models.Goal.findAll({
        include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'username']
        },{
            model: models.Goaldetail,
            as: 'goaldetail',
            attributes: ['id', 'detail', 'status']
        }]
    })
    .then(function(goals){
        res.json({
            message: "Here is the list of all goals",
            data: goals,
            status: true
        })
        console.log("Goal List rendered successfully");
    })
    .catch((error) => {
        console.log("There was an error listing all goals: " + error);
        res.json({
            message: `There was an error retrieving all goals: ${error}`,
            status: false
        })
    })
    
};



// GET request for the current logged in User Goals and Targets Aggregate
exports.getGoalAggregate = async function(req, res, next) {
    
    let total_goals;
    let total_goals_archieved = 0;
    let goal_Ids = [];
    let total_targets;
    let total_targets_done;
    
    // ********************************************CALCULATE TOTAL GOALS AND ACHIEVED GOALS**************************************
    // get all GOALS by the USER
    let goals = await models.Goal.findAll({
        where: {UserId: req.user.id}
    })
    total_goals = goals.length          // store the total goals value
    console.log(`THIS IS THE TOTAL GOAL COUNT: ${total_goals}`)
    
    // now get the ID of the goals
    await goals.forEach((goal)=>{
        goal_Ids.push(goal.id)
    })
    console.log(`THESE ARE THE GOAL IDS : ${goal_Ids}`)
    
    // check for archieved goals i.e a goal that has all it's goaldetail status=done
    await goals.forEach(async(goal)=>{
        
        let goal_unachieved = await models.Goaldetail.findAndCountAll({
            where: {
                GoalId: goal.id,
                status: 'undone'
            }
        })
        
        if(goal_unachieved.count === 0){
            total_goals_archieved =+ 1          // increment the achieved goals counter
            console.log(`THIS GOAL ${goal.goalName} has been archieved`);
        }
    })
    
    
    // ********************************************CALCULATE TOTAL TARGES AND ACHIEVED TARGETS**************************************
    // get all GOAL DETAILS of the GOALS
    let targets = await models.Goaldetail.findAndCountAll({
        where: {GoalId: goal_Ids}
    })
    total_targets = targets.count
    console.log(`THIS IS THE TOTAL TARGET COUNT: ${total_targets}`)
    
    // get all GOAL DETAILS of the GOALS where status = done
    let targets_done = await models.Goaldetail.findAndCountAll({
        where: {GoalId: goal_Ids, status: 'done'}
    })
    total_targets_done = targets_done.count
    console.log(`THIS IS THE TOTAL TARGET-DONE COUNT: ${total_targets_done}`)
    
    res.json({
        message: `GOALS AND TARGETS DETAILS FOR USER :${req.user.username}`,
        total_goals: total_goals,
        total_goals_archieved: total_goals_archieved,
        total_targets: total_targets,
        total_targets_archieved: total_targets_done,
        status: true
    })
};


 // asynchronous function for logging and returning error when the id passed in the req.params is not an integer
async function idError(req, res) {
    console.log(`The Goal id ${req.params.goal_id} passed is not an integer`);
    res.json({
        message: `This Goal id ${req.params.goal_id} passed is not an integer`,
        status: false
    })
}