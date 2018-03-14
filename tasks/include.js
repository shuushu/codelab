module.exports = function() {
    let path = this.opts.paths,
        $ = this.opts.plugins;

    this.gulp.src([
            path.src + '*.html',
            path.src + '**/*.html',
            '!' + path.src + 'inc/*.html', // include폴더 제외
            path.src + '**/**/*.html' // 레거시  iframe 폴더
        ])
        .pipe($.plumber({ errorHandler: this.opts.errorHandler }))
        .pipe($.fileInclude({
            // 변수
            context: {
                ROOT: '../../../../..',
                test: 'http://placehold.it',
                _html: {
                    top: '<div class="scroll_up_v2"><a href="#header">맨위로</a></div>',
                    temp: 'http://m1.nateimg.co.kr/n3main/thumb.png',
                    dumy: 'http://placehold.it'
                },
                live: 'http://news.nateimg.co.kr/etc/ui/images'
            },
            prefix: '@@',
            basepath: '@file' //@file : include 경로 상대적 위치,  @root
        }))
        .pipe($.cached('include'))
        .pipe($.size({ gzip: true, showFiles: true }))
        .pipe($.convertEncoding({to: 'euc-kr'}))
        .pipe(this.gulp.dest(path.dist))
        .pipe($.browserSync.reload({stream: true}))
};