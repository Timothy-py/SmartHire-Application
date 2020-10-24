var models = require("../models");
const axios = require("axios");



// Endpoint for getting all the goals of a user
exports.getGoalDetails = async function(req, res, next) {
    
    let current_user = req.user.username;
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)
    
     try {
        
        let response1 = await axios.get(`https://smarthireapi.herokuapp.com/smarthire/api/goaldetails/goal/${req.params.goal_id}`)
        
        let response2 = await axios.get(`https://smarthireapi.herokuapp.com/smarthire/api/goal/${req.params.goal_id}`)
        
        console.log("THE GOAL AND GOAL DETAILS WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var goaldetails = response1.data;
        console.log(goaldetails);
        var goal = response2.data;
        console.log(goal);
        
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    
    res.render('pages/index', {
        title: 'Smarthire', 
        goaldetails: goaldetails.data,
        goal: goal,
        message: req.flash('message'),
        page: 'goaldetailPage',
        username: current_user,
        role_name: role.role_name,
        display: 'goaldetailList',
        layout: 'layouts/main'});
    
};


// Endpoint for updating the status of a goal detail
exports.postUpdateGoaldetailStatus = async function(req, res, next) {
    console.log("THESE ARE THE BODY")
    console.log(req.body.details)
    
    try {
        
        let response1 = await axios.post(`https://smarthireapi.herokuapp.com/smarthire/api/goaldetail/${req.params.goal_id}/status`, {
            details: req.body.details
        })
        
        console.log("THE GOAL DETAIL STATUS WAS UPDATED SUCCESSFULLY BROOOOOO :) ")
        
        req.flash('message', 'Goal Details Updated Successfully')
        res.redirect(`/smarthire/main/goaldetails/goal/${req.params.goal_id}`);
        
    } catch (e) {
        console.log("UNABLE TO UPDATE THE GOAL DETAIL STATUS BROOOOOO!!!!")
        console.log(e)
    }
};


// Endpoint for deleting a goal detail
exports.getGoaldetailDelete = async function(req, res, next) {
    
    try {
        
        let response1 = await axios.get(`https://smarthireapi.herokuapp.com/smarthire/api/goaldetail/${req.params.goaldetail_id}/delete`)
        
        console.log("THE GOAL DETAIL WAS DELETED SUCCESSFULLY BROOOOOO :) ")
        console.log(response1.data);
        
        res.redirect(`/smarthire/main/goaldetails/goal/${req.params.goal_id}`);
        
    } catch (e) {
        console.log("UNABLE TO DELETE THE GOAL DETAIL BROOOOOO!!!!")
        console.log(e)
    }
    
};

// Endpoint for creating a goaldetail
exports.postGoaldetailCreate = async function(req, res, next) {
    
    console.log("THESE ARE THE BODY")
    console.log(req.body.detail)
    
    try {
        
        let response1 = await axios.post(`https://smarthireapi.herokuapp.com/smarthire/api/goaldetail/${req.params.goal_id}/create`, {
            detail: req.body.detail,
            headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE USER GOAL DETAIL WAS CREATED SUCCESSFULLY BROOOOOO :) ")
        
        res.redirect(`/smarthire/main/goaldetails/goal/${req.params.goal_id}`);
        
    } catch (e) {
        console.log("UNABLE TO CREATE THE USER GOAL DETAIL BROOOOOO!!!!")
        console.log(e)
    }
    
};