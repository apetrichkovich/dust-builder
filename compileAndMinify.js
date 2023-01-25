const fs = require('fs');
const exec = require('child-process-promise').exec;
const uglifyJS = require('uglify-js');

let promises = [];

function getFilesCode(path) {
    let code = {};
    for (const file of fs.readdirSync(path)) {
        if (file.endsWith('.js')) {
            code[file] = fs.readFileSync(path + '/' + file, 'utf8');
        }
    }
    return code;
}

const minify = function() {
    let result = uglifyJS.minify(fs.readFileSync('src/main/webapp/dev/js/common/app.js', 'utf8'), {
        compress: {
            dead_code: true,
            global_defs: {
                DEBUG: false
            }
        }
    });
    fs.writeFile('src/main/webapp/js/common/app.min.js', result.code, {flag: 'w'}, function(err) {
        if (err) {
            return console.log(err);
        }
    });

    result = uglifyJS.minify(getFilesCode('src/main/webapp/dev/js/pages'), {
        compress: {
            dead_code: true,
            global_defs: {
                DEBUG: false
            }
        }
    });
    fs.writeFile('src/main/webapp/js/pages/allPages.min.js', result.code, {flag: 'w'}, function(err) {
        if (err) {
            return console.log(err);
        }
    });

    result = uglifyJS.minify(getFilesCode('src/main/webapp/dev/js/views'), {
        compress: {
            dead_code: true,
            global_defs: {
                DEBUG: false
            }
        }
    });
    fs.writeFile('src/main/webapp/js/views/allViews.min.js', result.code, {flag: 'w'}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('minified');
        }
    });
};

const waitCompilation = function() {
    Promise.all(promises).then(function(results) {
        let templates = '';

        results.forEach(function(item) {
            templates += item.stdout;
        });

        fs.writeFile('src/main/webapp/js/templates/templates.js', templates, {flag: 'w'}, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log('compiled');
        });
    });
};

const compile = function() {
    fs.readdir('src/main/webapp/dev/templates/', function(err, files) {
        files.forEach(function(file) {
            const name = file
                .split('src/main/webapp/dev/templates/').join('')
                .split('.tl').join('');

            promises.push(exec('dustc --name=' + name + ' src/main/webapp/dev/templates/' + name + '.tl'));
        });

        waitCompilation();
    });
};

compile();

minify();