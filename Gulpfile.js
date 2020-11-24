var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require('gulp-inject-string');
var webpack = require('webpack');
var jshint = require('gulp-jshint');
var map = require('map-stream');
var bump = require('gulp-bump');
var argv = require('yargs').argv;
const fs = require('fs');
//var header = require('gulp-header');

var pkg = require('./package.json');

var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - '
+ '<%= new Date().toISOString() %>\n'
+ '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>'
+ '* Copyright (c) <%= new Date().getFullYear() %> <%= pkg.author.name %>;'
+ ' Licensed <%= pkg.license %> */'

var sjclSrc = [
  'src/js/sjcl/core/sjcl.js',
  'src/js/sjcl/core/aes.js',
  'src/js/sjcl/core/bitArray.js',
  'src/js/sjcl/core/codecString.js',
  'src/js/sjcl/core/codecHex.js',
  'src/js/sjcl/core/codecBase64.js',
  'src/js/sjcl/core/codecBytes.js',
  'src/js/sjcl/core/sha256.js',
  'src/js/sjcl/core/sha512.js',
  'src/js/sjcl/core/sha1.js',
  'src/js/sjcl/core/ccm.js',
  // 'src/js/sjcl/core/cbc.js',
  // 'src/js/sjcl/core/ocb2.js',
  'src/js/sjcl/core/hmac.js',
  'src/js/sjcl/core/pbkdf2.js',
  'src/js/sjcl/core/random.js',
  'src/js/sjcl/core/convenience.js',
  'src/js/sjcl/core/bn.js',
  'src/js/sjcl/core/ecc.js',
  'src/js/sjcl/core/srp.js',
  'src/js/sjcl-custom/sjcl-ecc-pointextras.js',
  'src/js/sjcl-custom/sjcl-secp256k1.js',
  'src/js/sjcl-custom/sjcl-ripemd160.js',
  'src/js/sjcl-custom/sjcl-extramath.js',
  'src/js/sjcl-custom/sjcl-montgomery.js',
  'src/js/sjcl-custom/sjcl-validecc.js',
  'src/js/sjcl-custom/sjcl-ecdsa-canonical.js',
  'src/js/sjcl-custom/sjcl-ecdsa-der.js',
  'src/js/sjcl-custom/sjcl-ecdsa-recoverablepublickey.js',
  'src/js/sjcl-custom/sjcl-jacobi.js'
];



var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

gulp.task('concat-sjcl', function() {
  return gulp.src(sjclSrc)
  .pipe(concat('sjcl.js'))
  .pipe(gulp.dest('./build/'));
});

gulp.task('build-node', [ 'concat-sjcl' ], function(callback) {
  webpack({
    cache: true,
    entry: './src/js/stream/index.js',
    output: {
      library: 'stream',
      path: './build/',
      filename: [ 'stream-node-', '.js' ].join(pkg.version)
    },
    target: 'node',
    externals: nodeModules,
    plugins: [
     new webpack.DefinePlugin({ "global.GENTLY": false })
    ],
  }, callback);
});

gulp.task('build', [ 'concat-sjcl' ], function(callback) {
  webpack({
    cache: true,
    entry: './src/js/stream/index.js',
    output: {
      library: 'stream',
      path: './build/',
      filename: [ 'stream-', '.js' ].join(pkg.version)
    },
  }, callback);
});

gulp.task('node-build', [ 'build-node' ], function(callback) {
  return gulp.src([ './build/stream-node-', '.js' ].join(pkg.version))
  .pipe(inject.append(';\n\nexports.stream = stream;'))
  .pipe(rename('stream.js'))
  .pipe(gulp.dest('./dist/node/'));
});

gulp.task('node-build-min', [ 'build-node-min' ], function(callback) {
  return gulp.src([ './build/stream-node-', '-min.js' ].join(pkg.version))
  .pipe(inject.append('exports.stream = stream;'))
  .pipe(rename('stream-min.js'))
  .pipe(gulp.dest('./dist/node/'));
});

gulp.task('node-build-debug', [ 'build-node-debug' ], function(callback) {
  return gulp.src([ './build/stream-node-', '-debug.js' ].join(pkg.version))
  .pipe(inject.append(';\n\nexports.stream = stream;'))
  .pipe(rename('stream-debug.js'))
  .pipe(gulp.dest('./dist/node/'));
});

gulp.task('bower-build', [ 'build' ], function(callback) {
  return gulp.src([ './build/stream-', '.js' ].join(pkg.version))
  .pipe(rename('stream.js'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('bower-build-min', [ 'build-min' ], function(callback) {
  return gulp.src([ './build/stream-', '-min.js' ].join(pkg.version))
  .pipe(rename('stream-min.js'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('bower-build-debug', [ 'build-debug' ], function(callback) {
  return gulp.src([ './build/stream-', '-debug.js' ].join(pkg.version))
  .pipe(rename('stream-debug.js'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('bower-version', function() {
  gulp.src('./dist/bower.json')
  .pipe(bump({version: pkg.version}))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('version-bump', function() {
  if (!argv.type) {
    throw new Error("No type found, pass it in using the --type argument");
  }
  gulp.src('./package.json')
  .pipe(bump({type:argv.type}))
  .pipe(gulp.dest('./'));
});

gulp.task('version-beta', function() {
  gulp.src('./package.json')
  .pipe(bump({version: pkg.version+'-beta'}))
  .pipe(gulp.dest('./'));
});

gulp.task('build-node-min', [ 'build-node' ], function(callback) {
  return gulp.src([ './build/stream-node-', '.js' ].join(pkg.version))
  .pipe(uglify())
  .pipe(rename([ 'stream-node-', '-min.js' ].join(pkg.version)))
  .pipe(gulp.dest('./build/'));
});

gulp.task('build-node-debug', [ 'concat-sjcl' ], function(callback) {
  webpack({
    cache: true,
    entry: './src/js/stream/index.js',
    output: {
      library: 'stream',
      path: './build/',
      filename: [ 'stream-node-', '-debug.js' ].join(pkg.version)
    },
    target: 'node',
    externals: nodeModules,
    plugins: [
     new webpack.DefinePlugin({ "global.GENTLY": false })
    ],
    debug: true,
    devtool: 'eval'
  }, callback);
});

gulp.task('build-min', [ 'build' ], function(callback) {
  return gulp.src([ './build/stream-', '.js' ].join(pkg.version))
  .pipe(uglify())
  .pipe(rename([ 'stream-', '-min.js' ].join(pkg.version)))
  .pipe(gulp.dest('./build/'));
});

gulp.task('build-debug', [ 'concat-sjcl' ], function(callback) {
  webpack({
    cache: true,
    entry: './src/js/stream/index.js',
    output: {
      library: 'stream',
      path: './build/',
      filename: [ 'stream-', '-debug.js' ].join(pkg.version)
    },
    debug: true,
    devtool: 'eval'
  }, callback);
});

gulp.task('lint', function() {
  gulp.src('src/js/stream/*.js')
  .pipe(jshint())
  .pipe(map(function(file, callback) {
    if (!file.jshint.success) {
      console.log('\nIn', file.path);

      file.jshint.results.forEach(function(err) {
        if (err && err.error) {
          var col1 = err.error.line + ':' + err.error.character;
          var col2 = '[' + err.error.reason + ']';
          var col3 = '(' + err.error.code + ')';

          while (col1.length < 8) {
            col1 += ' ';
          }

          console.log('  ' + [ col1, col2, col3 ].join(' '));
        }
      });
    }

    callback(null, file);
  }));
});

gulp.task('watch', function() {
  gulp.watch('src/js/stream/*', [ 'build-debug' ]);
});

gulp.task('default', [ 'concat-sjcl', 'build', 'build-debug', 'build-min' ]);

gulp.task('web', [ 'concat-sjcl', 'build', 'build-debug', 'build-min' ]);

gulp.task('node', [ 'concat-sjcl', 'node-build', 'node-build-debug', 'node-build-min' ]);

gulp.task('bower', ['bower-build', 'bower-build-min', 'bower-build-debug', 'bower-version']);