module.exports = function() {
    let path = this.opts.paths,
        $ = this.opts.plugins;

    $.browserSync({
        directory: true,
        //reloadDelay: 150,
        notify: false,
        server: {
            baseDir: './',
            middleware: [
                function (req, res, next) {
                    setCharset(req, res, next);
                }
            ]
        },
        port: 85,
        ui: {
            weinre: {
                port: 9090
            }
        },
        startPath: path.dist
        //open: "ui"
    });
};
