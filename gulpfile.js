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
  plumber      = require('gulp-plumber');

var paths = {
  sass: ['./scss/**/*.scss']
};

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

// .pipe(concat('default.css'))
    // .pipe(gulp.dest('./www/lib/'))
  gulp.src('./www/scss/main.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(addsrc.append('./www/css/style.css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(concat('default.min.css'))
    .pipe(gulp.dest('./www/lib/'))
    .on('end', done);
});

gulp.task('js', function(){
    gulp.src(jsPrimary)
    .pipe(concat('default.js'))
    .pipe(gulp.dest('./www/lib'));
});

gulp.task('js_prod', function(){
    gulp.src(jsPrimary)
    .pipe(concat('default.js'))
    .pipe(uglify({
        mangle : false,
        output : false,
        compress : false,
        preserveComments : false
    }))
    .pipe(gulp.dest('./www/lib'));
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