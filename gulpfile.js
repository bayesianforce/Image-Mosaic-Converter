/**
 * Created by Valerio Bartolini
 */
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  webpack = require('webpack'),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync').create();

var getWebpackConfig = function() {
  return {
    cache: true,
    context: __dirname + "/js",
    entry: {
      App: './App'
    },
    devtool: "source-map",
    externals: [],
    output: {
      path: path.join(__dirname, "dist/scripts"),
      filename: "Mosaic.[name].js",
      libraryTarget: "umd",
      library: ["Mosaic", "[name]"]
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: [/bower_components/, /node_modules/, /dist/],
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        }
      ]
    },
    plugins: [
      new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      )
    ]
  };
};

gulp.task('scripts', function(cb) {
  var conf = getWebpackConfig();
  webpack(conf, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      chunks: false
    }));
    cb();
  });
});

//Config
var cssDest = 'dist/css',
  cssFiles = [
    'css/mosaic.css'
  ];

gulp.task('css', function() {
  return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('mosaic.css'))
    .pipe(gulp.dest(cssDest))
    .pipe(rename('mosaic.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(cssDest));
});

gulp.task('lint-scripts', function() {
  gulp.src([
      'js/**/*.js',
      '!src/bower_components/**'
    ])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
});

gulp.task('scripts:dist', ['lint-scripts'], function(cb) {
  var conf = getWebpackConfig();
  conf.output.filename = "Mosaic.[name].min.js";
  conf.plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: true,
    output: {
      comments: false
    },
    compress: {
      drop_debugger: false,
      sequences: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: false
    }
  }));
  webpack(conf, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      chunks: false
    }));
    cb();
  });
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './',
      index: "mosaic.html"
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(['dist/script/*.js', 'dist/styles/*.css'], {
    interval: 1000, // default 100
    debounceDelay: 1000, // default 500
    mode: 'poll'
  }, browserSync.reload());

  gulp.watch(['js/App.js', 'js/**/*.js', cssFiles], {
    interval: 1000, // default 100
    debounceDelay: 1000, // default 500
    mode: 'poll'
  }, ['scripts:dist']);
});

gulp.task('default', ['watch', 'css', 'scripts:dist', 'browser-sync']);
gulp.task('build', ['css', 'scripts', 'scripts:dist']);
