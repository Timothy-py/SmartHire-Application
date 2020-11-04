var httpMocks = require('node-mocks-http');
var expect = require('chai').expect;
var tools = require('../modules/tools');

// tests against tools module

describe('/modules/tools.js ', function() {

    describe('generateMainMenu', function() {
        it('should generate non-empty res.locals.menuItems array', function() {
            var req = httpMocks.createRequest({
                _parsedUrl: {
                    pathname: "/siteAdmin"
                }
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.generateMainMenu(req, res, next);
            expect(res.locals.menuItems).to.be.a('Array').with.lengthOf.above(1);
        });

        it('should generate Main Menu (contains About Us page)', function() {
            var req = httpMocks.createRequest({
                _parsedUrl: {
                    pathname: "/siteAdmin"
                }
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.generateMainMenu(req, res, next);
            expect(res.locals.menuItems[1]).to.deep.include({
                label: 'About Us'
            });
        })

        it('should highlight proper menu item', function() {
            var req = httpMocks.createRequest({
                _parsedUrl: {
                    pathname: "/siteAdmin"
                }
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.generateMainMenu(req, res, next);
            expect(res.locals.menuItems[2].class).to.equal('menu-selected');
        });
    })

    describe('generateUserMenu', function() {
        it('should generate non-empty res.locals.menuItems array', function() {
            var req = httpMocks.createRequest({
                _parsedUrl: {
                    pathname: "/user"
                }
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.generateUserMenu(req, res, next);
            expect(res.locals.menuItems).to.be.a('Array').with.lengthOf.above(1);
        });

        it('should generate User Menu (contains My profile page)', function() {
            var req = httpMocks.createRequest({
                _parsedUrl: {
                    pathname: "/user"
                }
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.generateUserMenu(req, res, next);
            expect(res.locals.menuItems[1]).to.deep.include({
                label: 'My profile'
            });
        })

        it('should highlight proper menu item', function() {
            var req = httpMocks.createRequest({
                _parsedUrl: {
                    pathname: "/user"
                }
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.generateUserMenu(req, res, next);
            expect(res.locals.menuItems[1].class).to.equal('menu-selected');
        });
    })

    describe('onRequestStart', function() {
        it('should increment executionsThisTime application variable', function() {
            var req = httpMocks.createRequest({
                app: {
                    get: function(nameOfVariable) {
                        return this[nameOfVariable];
                    },
                    set: function(nameOfVariable, valueOfVariable) {
                        this[nameOfVariable] = valueOfVariable;
                    },
                    executionsThisTime: 4
                },
                session: {}
            });
            var res = httpMocks.createResponse();
            var next = function() {};

            tools.onRequestStart(req, res, next);
            expect(req.app.executionsThisTime).to.equal(5);
        })
    })

    describe('onRequestEnd', function() {
        it('should register function on finish and close events in res object', function() {
            var req = httpMocks.createRequest();
            var res = {
                on: function(nameOfVariable, valueOfVariable) {
                    this[nameOfVariable] = valueOfVariable;
                }
            };
            var next = function() {};

            tools.onRequestEnd(req, res, next);
            expect(res.finish).to.be.a('Function');
            expect(res.close).to.be.a('Function');
        })
    })

});
