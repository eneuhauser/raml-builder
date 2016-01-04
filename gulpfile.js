var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	raml2html = require('gulp-raml2html'),
	fileinclude = require('gulp-file-include'),
	replace = require('gulp-replace'),
	jsonFormat = require('gulp-json-format'),
	runSequence = require('run-sequence').use(gulp),
	del = require('del');
	
var src = './src/', dest = './dist/', input = 'index.raml';

gulp.task('raml:copy', function() {
  return gulp.src([src+input, src+'**/*.yaml'])
	.pipe(gulp.dest(dest));
});
gulp.task('raml:compile', function() {
  return gulp.src(dest + input)
	.pipe(plumber())
    .pipe(raml2html({https:true}))
    .pipe(replace('</head>', '<style>.modal-dialog { width: auto; margin-left:10px; margin-right:10px; }</style></head>'))
	.pipe(gulp.dest(dest));
});

gulp.task('build:raml', function(callback) {
	runSequence('raml:copy', 'raml:compile', callback);
});

gulp.task('build:schema', function() {
	return gulp.src([src+'**/*.schema.json'])
        .pipe(plumber())
		.pipe(fileinclude({
			prefix: '"!',
			suffix: '"',
			basepath: src
		}))
        .pipe(jsonFormat(4))
		.pipe(gulp.dest(dest));
});
gulp.task('schema:changed', function(callback) {
	runSequence('build:schema', 'raml:compile', callback);
})

gulp.task('build:example', function() {
	return gulp.src([src+'**/*.example.json'])
        .pipe(plumber())
		.pipe(fileinclude({
			prefix: '"!',
			suffix: '"',
			basepath: src
		}))
		.pipe(jsonFormat(4))
		.pipe(gulp.dest(dest));
});
gulp.task('example:changed', function(callback) {
	runSequence('build:example', 'raml:compile', callback);
})

gulp.task('clean', function(callback) {
    /** Based on this recipe: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md */
    del([dest], { force:true }, callback);
});

gulp.task('build', function(callback) {
	//runSequence('clean', ['build:schema', 'build:example'], 'build:raml', callback);
	runSequence('clean', ['build:schema', 'build:example'], 'build:raml', callback);
});

gulp.task('watch', [ 'build' ], function() {
	gulp.watch([src+input, src+'**/*.yaml'], [ 'build:raml' ]);
	gulp.watch([src+'**/*.schema.json', src+'**/*.schema.def.json'], [ 'schema:changed' ]);
	gulp.watch([src+'**/*.example.json', src+'**/*.example.res.json'], [ 'example:changed' ]);
});

gulp.task('default', [ 'build' ]);