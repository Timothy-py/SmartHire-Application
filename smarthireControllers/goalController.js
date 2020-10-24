var models = require("../models");
const axios = require("axios");
const moment = require('moment');
const { check, validationResult } = require('express-validator/check');


// Endpoint for getting all the goals of a user
exports.getGoals = async function(req, res, next) {
    
    let current_user = req.user.username;
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)
    
     try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/goals/user', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE GOALS WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var goals = response1.data;
        console.log(goals);
        console.log(`TOTAL GOALS: ${goals.data.length}`)
        
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    
    res.render('pages/index', {
        title: 'Smarthire', 
        goals: goals.data,
        page: 'goalPage',
        message: req.flash('message'),
        username: current_user,
        display: 'goalList',
        role_name: role.role_name,
        moment: moment,
        layout: 'layouts/main'});
    
};


// Endpoint for Deleting a Goal for a User
exports.getGoalDelete = async function(req, res, next) {
    
    try {
        
        let response1 = await axios.get(`https://smarthireapi.herokuapp.com/smarthire/api/goal/${req.params.goal_id}/delete`, {
        headers: {
            cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE GOAL WAS DELETED SUCCESSFULLY BROOOOOO :) ")
        console.log(response1.data);
        
        req.flash('message', 'Goal Deleted Successfully')
        res.redirect('/smarthire/main/goals');
        
    } catch (e) {
        console.log("UNABLE TO DELETE THE GOAL BROOOOOO!!!!")
        console.log(e)
    }
};


// Endpoint for Updating the Goal of a user
exports.postGoalUpdate = async function(req, res, next) {
    console.log("THESE ARE THE BODY")
    console.log(req.body.goalName)
    console.log(req.body.target_date)
    
    try {
        
        let response1 = await axios.post(`https://smarthireapi.herokuapp.com/smarthire/api/goal/${req.params.goal_id}/updateapi`, {
            goalName: req.body.goalName,
            target_date: req.body.target_date
        })
        
        console.log("THE USER GOAL WAS UPDATED SUCCESSFULLY BROOOOOO :) ")
        
        req.flash('message', 'Goal Updated Successfully')
        res.redirect('/smarthire/main/goals');
        
    } catch (e) {
        console.log("UNABLE TO UPDATE THE USER GOAL BROOOOOO!!!!")
        console.log(e)
    }
};


// Handle Goal Create on POST request API
exports.postGoalCreate = [
    
    [
        // check validations
        check('goalName')
        .isLength({
            min: 3,
            max: 40
        }).withMessage('Goal Name must be between 3 and 40 characters long')
        .not().isEmpty().withMessage('Goal Name cannot be empty'),
        
        check('target_date')
        .isDate({
            format: "YYYY/MM/DD"
        }).withMessage('Invalid Date Input. Format YYYY/MM/DD expected')  
        .not().isEmpty().withMessage('Target Date cannot be empty')
    ],
    
    async function(req, res, next) {
        // checks for validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                errors: errors.array()
            });
        }
    
    try{
        
        await models.Goal.create({
            goalName: req.body.goalName,
            target_date: req.body.target_date,
            UserId: req.user.id
        })
        .then((goal) => {
        
            // res.json({
            //     message: 'Goal Created successfully',
            //     data: goal,
            //     status: true
            // })
            
            req.flash('message', 'Goal Created Successfully')
            res.redirect('/smarthire/main/goals');
            console.log("Goal created successfully");
            console.log(goal);
            
        })
        
    }catch(error){
        console.log("There was an error creating the Goal: " + error);
        res.json({
            message: `There was an error creating the goal: ${error}`,
            status: false
        })
    }
    } 
];


// Endpoint for getting all the goals created by users in a department
exports.getGoalsDepartment = async function(req, res, next) {
    
    let current_user = req.user.username;
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)
    
     try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/goals/department', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE GOALS WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var goals = response1.data;
        console.log(goals);
        
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    
    res.render('pages/index', {
        title: 'Smarthire', 
        goals: goals.data,
        dept_name: goals.dept_name,
        page: 'goalPage',
        username: current_user,
        display: 'goalDetail',
        role_name: role.role_name,
        moment: moment,
        layout: 'layouts/main'});
    
};


async function idError(req, res) {
    console.log(`The Goal id ${req.params.goal_id} passed is not an integer`);
    res.json({
        message: `This Goal id ${req.params.goal_id} passed is not an integer`,
        status: false
    })
}