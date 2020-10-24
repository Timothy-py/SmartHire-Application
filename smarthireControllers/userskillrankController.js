var models = require("../models");
const axios = require("axios");


// Endpoint for Updating the skill rank of a user
exports.postUserSkillUpdate = async function(req, res, next) {
    console.log("THESE ARE THE BODY")
    // console.log(req.params.skill_id)
    console.log(`SKILL IDS ${req.body.skillName}`)
    console.log(`SKILL RANKS ${req.body.user_rank}`)
    
    try {
        
        let response1 = await axios.post(`https://smarthireapi.herokuapp.com/smarthire/api/userskillrank/update`, {
            user_rank: req.body.user_rank,
            skillName: req.body.skillName
        })
        
        console.log("THE USER RANK SKILL WAS UPDATED SUCCESSFULLY BROOOOOO :) ")
        console.log(response1.data);
        
        if(response1.data.data == 1){
            req.flash('message', 'Skill Rank Updated Successfully')
        }else{
            req.flash('message', 'Duplicate! Rank already exist')
        }
        
        res.redirect('/smarthire/main/skills');
        
    } catch (e) {
        console.log("UNABLE TO UPDATE THE USER RANK SKILL BROOOOOO!!!!")
        console.log(e)
    }
};