module.exports = function(grunt){
    require("time-grunt")(grunt); //grunt处理任务时间 进度条提示
    require("load-grunt-tasks")(grunt); //代替多个loadNpmTasks,只需要加载一次

    grunt.initConfig({
        //默认文件目录
        paths: {
            dist: "./dist",//输出的最终目录
            js: "./js",//js相关目录
            css: "./css"
        },

        //读取 包名
        pkg: grunt.file.readJSON("package.json"),

        archive_name: '<%= pkg.name %>'|| 'Winner',

        //清除之前的打包目录
        clean: {
            pre: ["public/", "dist/", "build/", "*.zip"],
            build: ["build/"],
            doc: ["doc"]
        },

        uglify: {
            options: {
                banner: '/*<%= pkg.name %><%= grunt.template.today("yyyy-mm-dd HH:MM:ss TT")%>*/',
                footer:  '\n/*! <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> footer*/'
            },
            compresAllJS: {
                files: [{
                    expand: true,
                    cwd: './dist',
                    src: 'js/*.js',
                    dest: 'build/js'
                }]
            },

            defaultJS:{
                files: [{
                    expand: true,
                    cwd: './',
                    src: 'js/*.js',
                    dest: 'build'
                }]

            }
        },

        less: {
            production: {
                files: {
//                    "./external/less/less.css": "./external/less/less.less"
                }
            }
        },

        //压缩css
        cssmin: {
            options: {
                //keepSpecialComments: 0, //删除特殊的注释, 不建议设置。 设置后可能会出现大面积的乱码
                banner:  '/*!压缩后的min.css,联系258246377@qq.com <%= pkg.name %><%= grunt.template.today("yyyy-mm-dd HH:MM:ss TT")%>*/'
            },

            minify: {
                expand: true,
                cwd: './css/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/css',
                ext: '.css'
            },

            //默认压缩
            defaultCss: {
                expand: true,
                cwd: './css/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/css',
                ext: '.css'
            }

        },

        //格式化和清理html
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeEmptyAttributes: true
                },
                expand: true,
                cwd: 'dist',
                src: ['./pages/*.html'],
                dest: 'build/'
            },
            dev: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeEmptyAttributes: true
                },
                files: {
                    '<%= paths.dist %>/index.html': './index.html'//清除html中的注释
                }
            }
        },

        //复制文件
        copy: {
            buildMain: {
                files: [
//                    {expand: true, cwd: "./dist", src: ['skin/css/**'], dest: 'build/'}, //css
                    {expand: true, cwd: "./dist", src: ['./images/**'], dest: 'build/'}//img
//                    ,{expand: true, cwd:"./dist", src: ['js/**'], dest: 'build/'} //js文件
//                    ,{expand: true, src: ['external/**'], dest: 'build/'} //外部文件
//                    ,{expand: true, src: ['pages/**'], dest: 'build/'} //其他页面
                    ,{expand: true, src: ['*', '!.gitignore', '!.DS_Store','!Gruntfile.js','!package.json','!node_modules/**','!go.sh','!.ftppass','!<%= archive_name %>*.zip', "!build", "!dist"], dest: 'build/'}
                ]
            },

            testMain: {
                files:[
                    { '<%= paths.dist %>/index.html': './index.html' }
                    ,{expand: true, cwd:"./", src: ['**.html'], dest: 'dist/'} //复制html 到测试版目录
//                    ,{expand: true, cwd:"./", src: ['external/**'], dest: 'dist/'} //复制外部文件 到测试版目录
                    ,{expand: true, cwd:"./", src: ['js/**'], dest: 'dist/'} //复制 js 到测试版目录
                    ,{expand: true, cwd:"./", src: ['css/**'], dest: 'dist/css'} //复制 css 到测试版目录
                    ,{expand: true, cwd:"./", src: ['images/**'], dest: 'dist/'} //复制 images 到测试版目录
                ]
            },

            defaultImg: {
                files: [
                    {expand: true, cwd: "./", src: ['./images/**'], dest: 'build/'}//img
                    ,{expand: true, cwd:"./", src: ['**.html'], dest: 'build/'} //复制html 到测试版目录
                    ,{expand: true, src: ['*', '!.gitignore', '!.DS_Store','!Gruntfile.js','!package.json','!node_modules/**','!go.sh','!.ftppass','!<%= archive_name %>*.zip', "!build", "!dist"], dest: 'build/'}
                ]
            }
        },

        //压缩最终Build文件夹
        compress: {
            main: {
                options: {
                    //mode: 'gzip',
                    //archive: '<%= archive_name %>_<%= grunt.template.today("yyyy-mm-dd HH:MM:ss TT")%>.zip'
                    archive: '<%= archive_name %>_<%= grunt.template.today("yyyy-mm-ddTTHH-MM-ss")%>.zip' //不知道为什么MM后不能用 ":"
                    //archive: '<%= archive_name %>_<%= grunt.template.today("yyyy年mm月dd日hh时MM分ss秒TT") %>.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*']
                //,dest: 'public/'
            }

        },

        // 文档生成工具

        jsdoc : {
            dist : {
                //src: ['src/**/*.js', 'README.md'],
                src: ["src/demo.js", "src/dialog.js"],
                //src: ["src/demo.js", 'src/dialog.js', 'README.md'],
                options: {
                    destination: 'doc'
                    ,template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },

        //开启静态服务器配置
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            all: {
                options: {
                    open: true,
                    base: ['.']
                }
            }
        },

        //监控Winner目录, 替代F5刷新
        watch: {
           livereload: {
               options: {
                   livereload: "<%=connect.options.livereload%>" //监听前面声明的商品 35729
               },
               files: [
                   '*.html',
                   './*.html',
                   './css/*',
                   './images/**/*',
                   'js/*',
                   '*/**'
               ]
           }
        },

        //部署到服务器上去
        "sftp-deply": {

        },



        //发布到FTP服务器 : 请注意密码安全，ftp的帐号密码保存在主目录 .ftppass 文件
        'sftp-deploy': {
            build: {
                auth: {
                    host: '你的服务器IP',
                    port: 22,
                    authKey: 'key2'
                },
                cache: 'sftpCache.json',
                src: 'build/(本地目录)',
                dest: '/home/wwwroot/default/(服务器目录)',
                exclusions: ['path/to/source/folder/**/.DS_Store', 'path/to/source/folder/**/Thumbs.db', 'path/to/dist/tmp'],
                serverSep: '/',
                concurrency: 14,//并发数，稍微大点,才能连成功
            progress: true
            }
        },

        combo: {
            options: {
                sourceMap: {
                    sourceRoot: './'
                }
            },
            build: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: './src/**/*.js',
                    dest: './dist',
                    ext: '.combo.js'
                }]
            }
        }

    });


    //  grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["clean:pre", "less", "cssmin:defaultCss", "uglify:defaultJS", "copy:defaultImg"]);

    grunt.registerTask("dev", ["clean:build", "copy:main"]);

    //执行 grunt bundle --最终输出的文件 < name-生成日期.zip > 文件
    grunt.registerTask("bundle", ["default",  "compress:main"]);



    //实时监控自动刷新
    grunt.registerTask("live", ["connect:all", "watch"]);

//    grunt.registerTask("ftp", ['ftpush']);

    grunt.registerTask("ssh", ['sftp-deploy']);

    //执行 grunt publish 可以直接上传项目文件到指定服务器FTP目录
    grunt.registerTask('publish', ['ftp-deploy']);


}