/*
* @Author: zhy18734828801
* @Date:   2017-11-09 11:16:52
* @Last Modified by:   zhy18734828801
* @Last Modified time: 2017-11-17 15:29:38
*/
var gulp     = require('gulp'),  
    concat   = require('gulp-concat'),//- 多个文件合并为一个；  
    cleanCSS = require('gulp-clean-css'),//- 压缩CSS为一行；  
    ugLify   = require('gulp-uglify'),//压缩js  
    imageMin = require('gulp-imagemin'),//压缩图片  
    pngquant = require('imagemin-pngquant'), // 深度压缩  
    htmlMin  = require('gulp-htmlmin'),//压缩html  
    changed  = require('gulp-changed'),//检查改变状态  
    less     = require('gulp-less'),//压缩合并less  
    del      = require('del'), 
    autoprefix = require('gulp-autoprefixer'),
    fileinclude  = require('gulp-file-include'),
    browserSync = require("browser-sync").create();//浏览器实时刷新  
  
//删除dist下的所有文件  
gulp.task('delete',function(cb){  
    return del(['dist/*','!dist/images'],cb);  
}) 

//定义html任务
gulp.task('html',function(){
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';
    gulp.src(htmlSrc)
        .pipe(changed('dist/', {hasChanged: changed.compareSha1Digest}))  
        .pipe(fileinclude({
                  prefix: '@@',
                  basepath: '@file'
            })
         )
        .pipe(gulp.dest(htmlDst))
        .pipe(browserSync.reload({
                stream: true
        }))
})

//实时编译less  
gulp.task('less', function () {  
    gulp.src(['src/less/*.less','!src/less/config.less']) //多个文件以数组形式传入  
        .pipe(changed('dist/css', {hasChanged: changed.compareSha1Digest}))  
        .pipe(less())//编译less文件   
        .pipe(autoprefix())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))//将会在css下生成main.css  
        .pipe(browserSync.reload({stream:true}));  
});  
  
//复制js  
gulp.task("script",function(){  
    gulp.src(['./src/scripts/*.js'])  
        .pipe(changed('dist/scripts', {hasChanged: changed.compareSha1Digest}))    
        .pipe(gulp.dest('dist/scripts'))  
        .pipe(browserSync.reload({stream:true}));  
});  
  
// 压缩图片  
gulp.task('images', function () {  
    gulp.src('./src/images/*.*')  
        .pipe(changed('dist/images', {hasChanged: changed.compareSha1Digest}))  
        .pipe(gulp.dest('dist/images'))  
        .pipe(browserSync.reload({stream:true}));  
});  

  
//启动热更新  
gulp.task('init',['delete'], function() {  
    gulp.start('images','less','script','html');  
});  
  
//启动热更新  
gulp.task('serve', ['init'], function() {   
  browserSync.init({  
      port: 2017,  
      server: {  
          baseDir: "./dist" 
      }
  });  
  gulp.watch('src/scripts/*.js', ['script']);         //监控文件变化，自动更新  
  gulp.watch(['src/less/*.less','src/less/common/*.less','src/less/base/*.less'], ['less']);  
  gulp.watch(['src/*.html','src/include/*.html'], ['html']);  
  gulp.watch('src/images/*.*', ['images']);  
});

gulp.task('default',['serve']);  