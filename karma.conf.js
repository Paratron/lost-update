module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // Configuration for plugins
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-coverage',
      '@angular-devkit/build-angular',
      '@angular-devkit/build-angular/plugins/karma',
    ],

    // Test results reporter to use
    // Possible values: 'dots', 'progress'
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // If true, Karma captures browsers, runs the tests, and exits
    singleRun: false,

    // Concurrency level
    // How many browser instances should be started simultaneously
    concurrency: Infinity,

    // Client configuration
    client: {
      jasmine: {
        // You can add Jasmine configuration options here
        // For example, you can change the timeout interval
        timeoutInterval: 5000,
      },
      clearContext: false, // Leave Jasmine Spec Runner output visible in the browser
    },

    // Custom launcher for Chrome (useful for CI environments)
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
  });
};
