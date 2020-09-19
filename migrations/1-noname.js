'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "CurrentBusinesses", deps: []
 * createTable "Departments", deps: []
 * createTable "Goals", deps: []
 * createTable "Goaldetails", deps: []
 * createTable "Roles", deps: []
 * createTable "Skills", deps: []
 * createTable "Skillpools", deps: []
 * createTable "Users", deps: []
 * createTable "Userskillranks", deps: []
 * createTable "UserSkills", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2020-09-18T19:22:06.783Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "CurrentBusinesses",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Departments",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Goals",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Goaldetails",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Roles",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Skills",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Skillpools",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Userskillranks",
            {

            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "UserSkills",
            {

            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
