module.exports = function() {
    let path = this.opts.paths,
        gulp = this.gulp,
        $ = this.opts.plugins,
        date = new Date().getTime();

    let spriteData = gulp.src([
            path.images + 'sprite/*.png',
            path.images + 'sprite/*.jpg',
            path.images + 'sprite/*.jpeg',
            path.images + 'sprite/*.gif'
        ])
        .pipe($.plumber({ errorHandler: this.opts.errorHandler }))
        .pipe($.cached('sprite'))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe($.spritesmith({
            //retinaSrcFilter: [ path.images +'sprite/*@2x.png' ],
            imgName: 'sprite.png',
            padding: 20,
            //retinaImgName: 'sprite@2x.png',
            imgPath : path.spriteSrc + 'sprite.png?' + date,
            cssName: '_sprite.scss'
        }));

    spriteData.img.pipe(gulp.dest(path.images));
    spriteData.css
        .pipe(gulp.dest(path.src + 'sass/styles/'))
        .pipe($.browserSync.reload({stream: true}));
};
