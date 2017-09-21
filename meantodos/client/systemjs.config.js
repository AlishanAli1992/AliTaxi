/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {

      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      //'angular2-google-maps/core': 'npm:angular2-google-maps/core/core.umd.js',
      //'@agm/core': 'npm:@agm/core/core.umd.js', // can delete
      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
      'angular2-google-maps': 'npm:angular2-google-maps',  // FIXED THE PROBLEM BY "downloading older version" npm install angular2-google-maps@0.16 --save
      //'angular2-text-mask': 'node_modules/angular2-text-mask',
      'angular2-text-mask': 'npm:angular2-text-mask/dist/angular2TextMask.js',
      'text-mask-core/dist/textMaskCore': 'npm:text-mask-core/dist/textMaskCore.js',
      'ngx-pagination': 'node_modules/ngx-pagination/dist/ngx-pagination.js',
      'moment': 'node_modules/moment',
      'moment-timezone': 'node_modules/moment-timezone/builds',
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'angular-in-memory-web-api': {
        main: './index.js',
        defaultExtension: 'js'
      },
      'angular2-google-maps/core': {     //must add google maps to packages so AOT can find the files and compile them
        "defaultExtension": "js",
        "main": "index.js"
      },
       'angular2-text-mask': { 
         defaultExtension: 'js' 
      },
      'ngx-pagination': { 
         "defaultExtension": "js"
      },
      'moment': { 
        main: './moment.js',
        defaultExtension: 'js' 
      },
      'moment-timezone': {
        main: './moment-timezone-with-data-2012-2022.min.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
