// karma.conf.js — ControlFit Frontend
// Extends Angular CLI defaults and adds lcov reporter for SonarQube

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // puedes agregar opciones de jasmine aquí
      },
      clearContext: false // deja visible el output de Jasmine en el browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // suprime las trazas duplicadas
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/controlfit-front'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcov' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
