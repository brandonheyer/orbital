'use strict';

var gulp = require( 'gulp' ),
    plugins = require( 'gulp-load-plugins' )(),
    del = require( 'del' ),
    runSequence = require( 'run-sequence' ),
    http = require( 'http' ),
    st = require( 'st' );

var paths = {
    scripts: 'app/**/*.js',
    typescripts: 'app/**/*.ts',
    sass: [ './app/sass/**/*.scss' ],
    templates: './app/templates/**/*.html',
    index: './app/index.html',
    server: './server/',
    dev: './dist/dev/',
    prod: './dist/prod/',
    system: 'systemjs.config.js',
    index: 'app/index.html',
    libs: {
        files: [
            'node_modules/core-js/client/shim.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/systemjs/dist/system.src.js'
        ],
        dirs: [
            'node_modules/@angular/**/*',
            'node_modules/angular2-in-memory-web-api/**/*',
            'node_modules/rxjs/**/*'
        ]
    }
};

var tsProject = plugins.typescript.createProject( 'tsconfig.json' );

plugins.livereload( {
    basePath: paths.dev,
    reloadPage: paths.dev + 'index.html'
} );

gulp.task( 'sass', function () {
    return gulp.src( paths.sass )
        .pipe( plugins.sass().on( 'error', plugins.sass.logError ) )
        .pipe( gulp.dest( paths.dev + 'styles' ) );
} );

gulp.task( 'typescript', function() {
    tsProject.src()
        .pipe( plugins.typescript( tsProject ) )
        .js
            .pipe( gulp.dest( paths.dev + 'app' ) );
} );

gulp.task( 'watch:sass', function() {
    gulp.watch( paths.sass, [ 'sass' ] );
} );

gulp.task( 'watch:templates', function() {
    gulp.watch( paths.templates, [ 'copy:dev:templates' ] );
} );

gulp.task( 'watch:typescript', function() {
    gulp.watch( paths.typescripts, [ 'typescript' ] );
} );

gulp.task( 'watch:index', function() {
    gulp.watch( 'app/index.html', [ 'copy:dev:index' ] );
} );

gulp.task( 'watch', [
    'watch:sass',
    'watch:typescript',
    'watch:index',
    'watch:templates'
] );

gulp.task( 'copy:dev:templates', function() {
    return gulp.src( paths.templates )
        .pipe( gulp.dest( paths.dev + 'templates' ) );
} );

gulp.task( 'copy:dev:libs:files', function() {
    return gulp.src( paths.libs.files )
        .pipe( gulp.dest( paths.dev + 'lib' ) );
} );

gulp.task( 'copy:dev:libs:dirs', function() {
    return gulp.src( paths.libs.dirs, { base: './node_modules' } )
        .pipe( gulp.dest( paths.dev + 'lib' ) );
} );

gulp.task( 'copy:dev:index', function() {
    return gulp.src( paths.index )
        .pipe( gulp.dest( paths.dev ) );
} );

gulp.task( 'copy:dev:system', function() {
    return gulp.src( paths.system )
        .pipe( gulp.dest( paths.dev ) );
} );

gulp.task( 'copy', [
    'copy:dev:index',
    'copy:dev:system',
    'copy:dev:libs:files',
    'copy:dev:libs:dirs',
    'copy:dev:templates'
] );

gulp.task( 'clean:dev', function() {
    return del( [ paths.dev ] );
} );

gulp.task( 'server', function() {
    var server = plugins.liveServer( paths.server + 'server.js' );
    server.start();

    gulp.watch( paths.dev + '**/*', function( file ) {
        server.notify.apply( server, [ file ] );
    } );

    gulp.watch( paths.server + '**/*', function() {
        server.start.bind( server )()
    } );
} );

gulp.task( 'dev', function() {
    runSequence(
        'clean:dev',
        [ 'typescript', 'sass', 'copy' ],
        [ 'server', 'watch' ]
    )
} );

gulp.task( 'default', [ 'dev' ] );
