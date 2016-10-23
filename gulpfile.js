var addsrc       = require('gulp-add-src');
var clean        = require('gulp-clean');
var gulp = require('gulp');
var uglify       = require('gulp-uglify');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var notify       = require('gulp-notify'),
  plumber      = require('gulp-plumber'),
  strip = require('gulp-strip-comments');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('dev', ['sass','js'],function(){

});

var onError = function (err) {
    notify.onError({
        title    : "Gulp",
        subtitle : "Failure!",
        message  : "Error: <%= error.message %>",
        sound    : "Beep"
    })(err);

    this.emit('end');
};


gulp.task('sass', function(done) {
  gulp.src('./www/scss/main.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(addsrc.append('./www/css/style.css'))
    .pipe(concat('default.css'))
    .pipe(gulp.dest('./www/lib/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/lib/'))
    .on('end', done);
});

gulp.task('js', function(){

  var jsPrimary = [
    "www/js/vendor/ionic/ionic.bundle.js",
    "www/js/vendor/**/*.*",
    "!www/js/vendor/angular/*.js",
    "!www/js/vendor/angular-animate/*.js",
    "!www/js/vendor/angular-sanitize/*.js",
    "!www/js/vendor/angular-ui-router/*.js",
    "www/js/app.js",
    "www/js/service/*.*",
    "www/js/controller/**.*"
  ];

    gulp.src(jsPrimary)
    .pipe(concat('default.js'))
    .pipe(strip())
    .pipe(gulp.dest('./www/lib'));
    // .pipe(uglify())
    // .pipe(concat('default.min.js'))
    // .pipe(gulp.dest('./www/lib'));

});

gulp.task('bower', function () {
    require('bower-installer');
});

gulp.task('_cleanAll', function () {
    gulp.src('www/**/vendor/')
        .pipe(clean());          
});

gulp.task('watch', ['dev'] ,  function() {
  gulp.watch(['./www/js/**'], ['js']);
  gulp.watch(['./www/scss/**'], ['sass']);
});
gulp.task('default', ['watch']);

// gulp.task('install', ['git-check'], function() {
//   return bower.commands.install()
//     .on('log', function(data) {
//       gutil.log('bower', gutil.colors.cyan(data.id), data.message);
//     });
// });

// gulp.task('git-check', function(done) {
//   if (!sh.which('git')) {
//     console.log(
//       '  ' + gutil.colors.red('Git is not installed.'),
//       '\n  Git, the version control system, is required to download Ionic.',
//       '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
//       '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
//     );
//     process.exit(1);
//   }
//   done();
// });
