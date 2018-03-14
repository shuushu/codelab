// browserSync Middleware
global.setCharset = (req, res, next) => {
    let urlParse = url.parse(req.url);

    if (/\.html$/.test(urlParse.pathname)) {
        let data = fs.readFileSync(pathss.join('./', urlParse.pathname)),
            source = iconvLite.decode(new Buffer(data, 'binary'), "EUC-KR");

        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        res.end(source);
    } else {
        next();
    }
};


let pkg = require('./package.json'),
    gulp = require('gulp'),
    //parmas = require('yargs').argv,
    $ = require('gulp-load-plugins')({
        pattern: ["*"],
        scope: ["dependencies"]
    }),
    // middleware plugin
    jschardet = require('jschardet'),
    pathss = require('path'),
    fs = require('fs'),
    url = require('url'),
    iconvLite = require('iconv-lite'),
    inquirer = require('inquirer'),
    callBackFunc = function (PATH) {
        gulp.watch(PATH.src + 'sass/**/*', ['sass']);
        gulp.watch(PATH.src + 'js/*', ['minify']);
        gulp.watch([PATH.src + '*.html', PATH.src + '**/*.html'], ['include']);

        let imgWatcher = $.chokidar.watch(PATH.images + 'sprite/*', {});

        imgWatcher.on('all', function (event) {
            console.log('> eventtype is ', event);

            gulp.start(['sprite']);
        });
    },
    regacyCallback = function (path) {
        gulp.watch([
            path.trunk + 'src/inc/*.html',
            path.trunk + 'src/inc/**/*.html',
            path.src + '**/**/*.html',
            path.src + '**/*.html'
        ], ['include']);

        // CSS watch
        gulp.watch([path.trunk + 'release/css/**/*', path.trunk + 'release/css/*'])
            .on('change', $.browserSync.reload);
    };


function loadTask (task) {
    var target = pkg.paths[task];

    require('gulp-task-loader')({
        dir: 'tasks',
        paths: target,
        plugins: $,
        errorHandler: function(e) {
            console.error(e.message);
            this.emit('end');
        }
    });
    // 운영 테스크
    gulp.task('regacy', ['browserSync', 'include'], function () {
        return regacyCallback(target);
    });

    // 특집 테스크
    gulp.task('special', ['browserSync', 'sprite', 'sass', 'include', 'minify'], function () {
        return callBackFunc(target);
    });

    if (task.indexOf(('regacy')) < 0) {
        gulp.start(['special']);
    } else {
        gulp.start(['regacy']);
    }
}

gulp.task('choice', function () {
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'theme',
            message: 'choice task',
            choices: ['regacy_pc', 'regacy_m', 'wcup2018_pc','wcup2018_m', 'vote2018_pc', 'vote2018_m']
        }
    ]).then(function (task) {
        loadTask(task.theme);
    });
});