module.exports = function() {
	let gulp = this.gulp,
		path = this.opts.paths,
		$ = this.opts.plugins;

		gulp.src(path.src + 'js/*')
            .pipe($.plumber({ errorHandler: this.opts.errorHandler }))
            .pipe($.sourcemaps.init())
			.pipe($.minify({
                ext:{
                    src:'-debug.js',
                    min:'.js'
                },
                exclude: ['tasks'],
                ignoreFiles: ['.combo.js', '-min.js']
			}))
            .pipe($.cached('minify'))
            .pipe($.size({ gzip: true, showFiles: true }))
            .pipe($.convertEncoding({to: 'euc-kr'}))
            .pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest(path.dist + 'js'))
            .pipe($.browserSync.reload({stream: true}))
};