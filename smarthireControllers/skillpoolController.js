var Roles = require("../models/role");
const axios = require("axios");
var models = require("../models");
// const { check, validationResult } = require('express-validator/check');


// Endpoint for listing all the skills for a department
exports.getSkillpool = async function(req, res, next) {
    
    let current_user = req.user.username;
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)
    
    try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/skills/department', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE DATA WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var skillpool = response1.data;
        console.log(skillpool);
        console.log(`THIS IS THE SKILLPOOL DATA ${skillpool.data}`)
        
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    res.render('pages/index', {
        title: 'Smarthire', 
        skillpool: skillpool.data,
        skillpoolId: skillpool.skillpoolId,
        message: req.flash('message'),
        page: 'skillpoolPage',
        display: 'skillpoolList',
        username: current_user,
        role_name: role.role_name,
        layout: 'layouts/main'});
}


// Endpoint for listing all the skills for a department for users to add skill
exports.getSkillpoolUser = async function(req, res, next) {
    
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)
    
    let current_user = req.user.username;
    
    try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/skills/department', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        console.log("ALL THE SKILLS FOR THE DEPARTMENT WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var skillpool = response1.data;
        console.log(skillpool);
        
        
        let response2 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/userskillrank/skills/user', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("ALL THE SKILLS OF THE USER WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var user_skills = response2.data.data;
        console.log(user_skills);
        
        
        var userSkills = [];
      	if(user_skills){
      		user_skills.forEach((skill)=>{
      			userSkills.push(skill.skillName)
      		})
      	}
        console.log(userSkills)
        
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    res.render('pages/index', {
        title: 'Smarthire', 
        skillpool: skillpool.data,
        user_skills: userSkills,
        page: 'skillpoolPage',
        display: 'skillpoolDetail',
        username: current_user,
        role_name: role.role_name,
        layout: 'layouts/main'});
}

// API Endpoint for Creating a Skillpool for a department
exports.postSkillpoolCreate = async (req, res, next) => {

    console.log(`User ID ${req.user.id}`);
    console.log(`Department Id ${req.user.DepartmentId}`)
    console.log(`CurrentBusinessId ${req.user.CurrentBusinessId}`)
        
    try{
        
        var skillpool = await models.Skillpool.create({
            skillpoolName: req.body.skillpoolName,
            DepartmentId: req.user.DepartmentId,
            CurrentBusinessId: req.user.CurrentBusinessId,
            UserId: req.user.id
        })
        
        req.flash('message', 'Skillpool Created Successfully')
        
        res.redirect('/smarthire/main/skillpool');
        console.log("Skillpool Created successfully");
        
        } catch (error) {
            console.log('There was an error creating the Skillpool: ' + error); 
            res.json({
                message: `There was an error creating the skillpool: ${error}`,
                status: false
            })
        }

};


// Endpoint for Deleting Skillpool for a Department
exports.getSkillpoolDelete = async function(req, res, next) {
    
    try {
        
        let response1 = await axios.get(`https://smarthireapi.herokuapp.com/smarthire/api/skillpool/${req.params.skillpool_id}/delete`, {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        console.log("THE SKILLPOOL WAS DELETED SUCCESSFULLY BROOOOOO :) ")
        console.log(response1.data);
        
        req.flash('message', 'Skillpool Deleted Successfully');
        res.redirect('/smarthire/main/skillpool');
        
    } catch (e) {
        console.log("UNABLE TO DELETE THE SKILLPOOL BROOOOOO!!!!")
        console.log(e)
    }
};