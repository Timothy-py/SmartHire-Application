var models = require("../models");
const axios = require("axios");

/* GET home page. */
exports.getIndex = async function(req, res, next) {
    
    let current_user = req.user.username;
    let role = await models.Role.findByPk(req.user.RoleId)
    console.log(`ROLE NAME: ${role.role_name}`)

    try {
        
        let response1 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/goals/aggregate', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        let response2 = await axios.get('https://smarthireapi.herokuapp.com/smarthire/api/user/skillmatrix', {
          headers: {
              cookie: req.headers.cookie,
          } 
        })
        
        
        console.log("THE DATA WAS SUCCESSSFULLYY RETRIEVED BROOOOOO :) ")
        var goals_and_targets = response1.data;
        var skillmatrix = response2.data;
        console.log(goals_and_targets);
        console.log(skillmatrix);
        
        // precise skill matrix
        var preciseMatrix = null
        if(skillmatrix.matrix){
            preciseMatrix = (skillmatrix.matrix).toPrecision(2)
        }
        
    } catch (e) {
        console.log("UNABLE TO GET THE DATA BROOOOOO!!!!")
        console.log(e)
    }
    
    res.render('pages/index', {
        title: 'Smarthire', 
        page: 'homePage',
        goals_and_targets: goals_and_targets,
        skillmatrix: skillmatrix,
        matrix: preciseMatrix,
        username: current_user,
        role_name: role.role_name,
        layout: 'layouts/main'});
};


// Login page
exports.getLogin = function(req, res, next) {
    
    res.render('pages/index', {
        page: 'authPage',
        display: 'login',
        title: 'Login',
        layout: 'layouts/auth'
        });
    
};