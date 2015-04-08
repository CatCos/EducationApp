/* global module, require */

var fs   = require('fs');
var jade = require('jade');

var fn_index;
module.exports.compileViews = function(){

    //compile index view
    fs.readFile('./views/index.jade', 'utf8', function (err, data) {
        if (err) throw err;
        fn_index = jade.compile(data, {
            filename: './views/html-head/layout.jade'
        });

        module.exports.view_index   = fn_index;
    });

};

