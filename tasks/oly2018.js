module.exports = function() {
    let gulp = this.gulp,
        plugins = this.opts.plugins,
        // SPRITE = require("./trigger_sprite.js"),
        SASS = require("./trigger_sass.js"),
        HTML = require("./trigger_html.js"),
        // chokidar = require('chokidar'),
        convertEncoding = require('gulp-convert-encoding');


    function loaderTask(params){
        let path = {
            srcPath: './new_trunk/special/' + params + '/src',
            distPath: './new_trunk/special/' + params + '/dist',
            imgPath: './new_trunk/images/' + params,
            cssPath: '../../../../../images/'+ params,
        };

        gulp.task('html', () => {
            HTML(path.srcPath, path.distPath);
        });

        /*gulp.task('sprite', () => {
            SPRITE(path.imgPath, path.srcPath, path.cssPath);
        });*/

        gulp.task('sass', () => {
            SASS(path.srcPath, path.distPath);
        });

        gulp.task('copyjs', () => {
            gulp.src([
                        path.srcPath + '/js/*.',
                        path.srcPath + '/js/**/*',
                    ])
                .pipe(plugins.plumber({ 
                    errorHandler: function(){
                        this.emit('end');
                    }
                }))
                .pipe(convertEncoding({to: 'euc-kr'}))
                .pipe(plugins.copy(path.distPath, { prefix: 5 }))
        });

        gulp.task('serve', ['html', 'copyjs', 'sass'], () => {
            plugins.browserSync.init({
                directory: true,
                server: {
                    baseDir: './',
                    middleware: [
                        function (req, res, next) {
                            setCharset(req, res, next);
                        }
                    ]
                },
                port: 80,
                ui: {
                    weinre: {
                        port: 9090
                    }
                },
                //open: "ui",
                startPath: path.distPath
            });

            // chokidar.watch(path.imgPath + '/sprite/*').on('change', () => {
            //     console.log('4444')
            //
            //     gulp.start(['sprite']);
            //     plugins.browserSync.reload();
            // });

            /*let watcher = chokidar.watch(path.imgPath + '/sprite/!*', {});

            watcher.on('change', () => {
                    gulp.start(['sprite']);
                    plugins.browserSync.reload();
                });*/

            /*watcher
                .on('add', () => {
                    gulp.start(['sprite']);
                })
                .on('change', () => {
                    gulp.start(['sprite']);
                    plugins.browserSync.reload();
                })
                .on('unlink', () => {
                    gulp.start(['sprite']);
                    plugins.browserSync.reload();
                });*/

            gulp.watch([ path.srcPath + '/js/*.', path.srcPath + '/js/**/*' ], ['copyjs']).on('change', () => {
                plugins.browserSync.reload();
            });
            gulp.watch([path.srcPath + '/sass/styles/*', path.srcPath + '/sass/*'], ['sass']).on('change', () => {
                plugins.browserSync.reload();
            });
            gulp.watch([
                path.srcPath + '/*.html',
                path.srcPath + '/**/*.html'
            ], ['html']).on('change', () => {
                plugins.browserSync.reload();
            });
        });

        gulp.start(['serve']);
    }

    // function buildTask(params){
    //     if (params) {
    //         throw Error(params);
    //     }
    // }

    // function taskPrompt(choice){
    //     let type = choice.theme;
    //     inquirer.prompt([
    //         {
    //             type: 'rawlist',
    //             name: 'theme',
    //             message: 'Task is DEV / BUILD',
    //             choices: ['dev','build']
    //         }
    //     ]).then(function (task) {
    //         (type === 'dev') ? loaderTask(task.theme) : buildTask(task.theme);
    //     });
    // }

    gulp.task('choice', function(){
        inquirer.prompt([
            {
                type: 'rawlist',
                name: 'theme',
                message: 'choice task',
                choices: ['oly2018/m','oly2018/pc']
            }            
        ]).then(function (task) {
            // taskPrompt(answers);
            loaderTask(task.theme)
        });
    });

    gulp.start('choice');
};
