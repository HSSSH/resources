/*
 * @description 前端代码打包压缩配置文件（执行以下操作前需下载安装nodejs）
 *  步骤： 
*  	初始项目时执行：
*              1、全局安装 gulp：npm install gulp -g
*              2、当前目录执行 gulp 构建任务：gulp default
 *             3、当前目录执行文件复制任务：gulp copy
 *             开发调试时执行：
 *             1、gulp watch
 *             部署时执行：
 *             1、把js打包输出为一个文件，当前路径：node r.js -o js.build.js
 *             2、把css打包输出为一个文件，当前路径：node r.js -o css.build.js            
 *             3、给css打包输出的文件和js打包输出的文件添加指纹：gulp hashjs  ; gulp hashcss（如果不作缓存版本控制，可忽略该步骤）
 *             4、执行 gulp initapp，在resource路径下生成app.html
 *             5、app.html 文件修改css引入路径和requirejs引入路径,其中 build-3727c2e5c6.min.css 为css打包添加指纹后的的文件，build-1ddbcdf0ed.js
 *             为js打包添加指纹后的文件：
 *              <link rel="stylesheet" href="css/build-3727c2e5c6.min.css" />
 *              <script  data-main="build-1ddbcdf0ed.js" src="js/require.min.js" ></script>
 * */
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev2');
var sass = require('gulp-sass-china');

var isDev = true;
var sourcePath = 'static/'; //源文件根目录
var desPath = 'resources/'; //构建后文件根目录
var jsSourcePath = 'script/**/*.js';
var jsDesPath = 'script/';
var cssSourcePath = 'css/**/*.css';
var cssDesPath = 'css/';
var sassDesPath = 'css/';
var sassSourcePath = 'sass/**/*.scss';
var imageSourcePath = 'images/**/*';
var imageDesPath = 'images/';
var copyPaths = [];


var handleError = function (err) {  //错误处理
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('initapp', function() {
	 gulp.src(sourcePath + 'app.html')
     .pipe(gulp.dest(desPath));
});

//压缩js
gulp.task('watchjs', function () {
    gulp.watch(sourcePath + jsSourcePath, function (event) { //监听目录下所有js文件改动
        var paths = watchPath(event, sourcePath, desPath)  //获取发生变化的js路径
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        if (isDev) {
        	var combined = combiner.obj([   //组合一系列任务
                gulp.src(paths.srcPath),  //获取路径下的文件
                sourcemaps.init(),  //开发环境使用 sourcemap 帮助调试，生产环境部署可去除
                uglify(),  //压缩                      
                sourcemaps.write(), 
                gulp.dest(paths.distDir), //输出压缩后的文件         
            ]);
        } else {
        	var combined = combiner.obj([   //组合一系列任务
                gulp.src(paths.srcPath),  //获取路径下的文件
                uglify(),  //压缩                      
                gulp.dest(paths.distDir), //输出压缩后的文件         
            ]);
        }
        
        combined.on('error', handleError);
    })
});

gulp.task('uglifyjs', function () {  //配置手动执行的js压缩任务，可在命令行输入 gulp uglifyjs 启动压缩
    if (isDev) {
    	var combined = combiner.obj([
             gulp.src(sourcePath + jsSourcePath),
             sourcemaps.init(),
             uglify(),
             sourcemaps.write(),
             gulp.dest(desPath + jsDesPath)
         ]);
    } else {
    	var combined = combiner.obj([
             gulp.src(sourcePath + jsSourcePath),
             uglify(),
             gulp.dest(desPath + jsDesPath)
         ]);
    }
	
    combined.on('error', handleError)
});


gulp.task('watchcss', function () {   //自动监听css改动压缩css
    gulp.watch(sourcePath + cssSourcePath, function (event) {
        var paths = watchPath(event, sourcePath, desPath)

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        if (isDev) {
        	gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())            
            .pipe(minifycss())
            .pipe(sourcemaps.write(''))
            .pipe(gulp.dest(paths.distDir))
        } else {
        	gulp.src(paths.srcPath)       
            .pipe(minifycss())
            .pipe(gulp.dest(paths.distDir))
        }
        
    })
});

//配置手动执行的css压缩任务，可在命令行输入 gulp minifycss 启动压缩
//因为项目中要采用sass编译书写css，若使用r.js打包输出，实际开发时已经不需要再次启动压缩css的任务，可忽略
gulp.task('minifycss', function () { 
    if (isDev) {
    	gulp.src(sourcePath + cssSourcePath)
        .pipe(sourcemaps.init())        
        .pipe(minifycss())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(desPath + cssDesPath))
    } else {
    	gulp.src(sourcePath + cssSourcePath)  
        .pipe(minifycss())
        .pipe(gulp.dest(desPath + cssDesPath))
    }	
});

gulp.task('compilesass', function() {  
    gutil.log('编译sass');
	gulp.src(sourcePath + sassSourcePath)//'static/sass/**/*.scss'
		.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        // 将编译后的.css文件存放在.scss文件所在目录下  
        .pipe(gulp.dest(desPath + sassDesPath))//'static/css'

    gulp.src(sourcePath + sassSourcePath)//'static/sass/**/*.scss'
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(sourcePath + sassDesPath))//'static/css'
});

gulp.task('watchsass',function (){
    gulp.watch(sourcePath + sassSourcePath, ['compilesass'])
});

gulp.task('watchimages', function () {  //自动监听image改动压缩image
    gulp.watch(sourcePath + imageSourcePath, function (event) {
        var paths = watchPath(event, sourcePath, desPath)

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
});

gulp.task('minifyimage', function () {  //配置手动执行的图片压缩任务，可在命令行输入 gulp image 启动压缩
    gulp.src(sourcePath + imageSourcePath)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(desPath + imageDesPath))
});

gulp.task('copy', function () {  //配置文件复制任务
    copyPaths.forEach(function(path) {
        gulp.src(sourcePath + path.split(',')[0])
        .pipe(gulp.dest(desPath + path.split(',')[1]));
    });   
});

gulp.task('hashjs', function() { //生成文件指纹
	gulp.src(desPath + 'build.js')  
    .pipe(rev())
    .pipe(gulp.dest(desPath))
    .pipe(rev.manifest())             
    .pipe(gulp.dest('.'))  
});

gulp.task('hashcss', function() { //生成文件指纹 
    gulp.src(desPath + 'build.min.css')  
    .pipe(rev())
    .pipe(gulp.dest(desPath))
    .pipe(rev.manifest())             
    .pipe(gulp.dest('.')) 
});


gulp.task('default', [  //命令行输入 gulp build 编译
    'uglifyjs', 'minifyimage','compilesass'
    ]
);

gulp.task('watch', ['uglifyjs', 'compilesass', 'watchjs', 'watchimages', 'watchsass']);
