module.exports = function() {
    let path = this.opts.paths,
        gulp = this.gulp,
        $ = this.opts.plugins;

    gulp.src(path.src + 'sass/*.scss')
        .pipe($.plumber({ errorHandler: this.opts.errorHandler }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            sourceComments: false,
            outputStyle: 'compressed'
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 4 versions'],
            cascade: true
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe($.cached('sass'))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(path.dist + 'css/'))
        .pipe($.convertEncoding({to: 'euc-kr'}))
        .pipe($.browserSync.reload({stream: true}))
};
