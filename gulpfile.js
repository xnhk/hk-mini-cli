const {
    src,
    lastRun,
    dest,
    series,
    parallel,
    watch
} = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const path = require('path');
sass.compiler = require('node-sass');
const rename = require("gulp-rename"); // 修改文件名

const srcPath = './src/**'
const distPath = './dist/'
function _templatePath(key) {
    return [
        srcPath + `*.${key}`,
        srcPath + `/**/*.${key}`,
        srcPath + `/**/**/*.${key}`,
        `!${srcPath}/_template/*.${key}`,
        `!${srcPath}/**/_template/*.${key}`,
    ]
}
const wxmlPath = _templatePath('wxml')
const jsPath = _templatePath('js')
const jsonPath = _templatePath('json')
const scssPath = _templatePath('scss')

function clean(done) {
    del.sync([
        distPath + '**/*',
        distPath + '**/**/*',
        distPath + '**/**/**/*',
    ]);
    done()
}

function wxml() {
    return src(wxmlPath, {
        since: lastRun(wxml)
    })
        .pipe(dest(distPath))
}
function jsFiles() {
    return src(jsPath, {
        since: lastRun(jsFiles)
    })
        .pipe(dest(distPath))
}

function jsonFiles() {
    return src(jsonPath, {
        since: lastRun(jsonFiles)
    })
        .pipe(dest(distPath))
}
function wxssFiles() {
    return src(scssPath, {
        since: lastRun(wxssFiles)
    })
        .pipe(sass())
        .pipe(rename({ extname: '.wxss' }))
        .pipe(dest(distPath))
}
function watchFn() {
    let watchScssFiles = [...scssPath];
    watchScssFiles.pop();
    watch(wxmlPath, wxml)
    watch(jsPath, jsFiles)
    watch(jsonPath, jsonFiles)
    watch(watchScssFiles, wxssFiles)
}


function create() {
    const yargs = require('yargs')
        .example('gulp create -p pagename', '创建page ')
        .example('gulp create -c componentname', '创建component')
        .option({
            s: {
                alias: 'src',
                default: '_template',
                describe: 'copy的模板',
                type: 'string'
            },
            p: {
                alias: 'page',
                describe: '生成page文件',
                conflicts: ['c'],
                type: 'string',
            },
            c: {
                alias: 'component',
                describe: '生成的component名称',
                type: 'string'
            },
            version: { hidden: true },
            help: { hidden: true }
        })
        .fail(msg => {
            done();
            console.error('创建失败!!!');
            console.error(msg);
            console.error('请按照如下命令执行...');
            yargs.parse(['--msg']);
            return;
        })
        .help('msg');

    const argv = yargs.argv
    const source = argv.s   
    const typeEnum = {
        p: 'pages',
        c: 'components', 
    }

    let hasParams = false;
    let name, type;
    for (let key in typeEnum) {
      hasParams = hasParams || !!argv[key];
      if (argv[key]) {
        name = argv[key];
        type = typeEnum[key];
      }
    }
  
    if (!hasParams) {
      done();
      yargs.parse(['--msg']);
    }
    const root = path.join(__dirname, 'src', type);
    return src(path.join(root, source, '*.*'))
      .pipe(
        rename({
          dirname: name,
          basename: name
        })
    )
    .pipe(dest(path.join(root)));
}



exports.build = series(clean, parallel(wxml, jsFiles, jsonFiles, wxssFiles))
exports.watch = series(watchFn)
exports.create = series(create)
exports.dev = series(clean, parallel(wxml, jsFiles, jsonFiles, wxssFiles), watchFn)