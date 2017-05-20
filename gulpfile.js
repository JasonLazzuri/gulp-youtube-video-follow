var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  del = require('del'),
  compass = require('gulp-compass');


// scripts task
gulp.task('scripts', function(){
  gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
  .pipe(plumber())
  .pipe(rename({suffix:'.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
  .pipe(reload({stream:true}));

});

// compass sass task
gulp.task('compass', function(){
  gulp.src('app/scss/style.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb',
      css: 'app/css',
      sass: 'app/scss',
      require: ['susy']
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('app/css/'))
    .pipe(reload({stream:true}));
});

// html task
gulp.task('html', function(){
  gulp.src('app/**/*.html')
  .pipe(reload({stream:true}));
});

// clear out al the files and remove folders from the build folder

gulp.task('build:cleanfolder', function(){
  del([
    'build/**'
  ]);
});

// build tasks-- task to create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
  return gulp.src('app/**/*/')
  .pipe(gulp.dest('build/'));
});

// task to remove unwanted build files
// list all files and directories here that you dont want to include
gulp.task('build:remove', ['build:copy'], function(){
  del([
      'build/scss/',
      'build/js/!(*.min.js)'
  ]);
});

gulp.task('build', ['build:copy', 'build:remove']);



// browser sync tasks
gulp.task('browser-sync', function(){
  browserSync({
      server:{
        baseDir: './app/'
      }
  });
});

// browser sync tasks
gulp.task('build:serve', function(){
  browserSync({
      server:{
        baseDir: './build/'
      }
  });
});


// watch tasks
gulp.task('watch', function(){
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/scss/**/*.scss', ['compass']);
  gulp.watch('app/**/*.html', ['html']);

});


// default task
gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);
