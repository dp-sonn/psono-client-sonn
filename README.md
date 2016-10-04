# PSONO Server - Password Manager

[![build status](https://gitlab.com/psono/psono-client/badges/master/build.svg)](https://gitlab.com/psono/psono-client/commits/master) [![coverage report](https://gitlab.com/psono/psono-client/badges/master/coverage.svg)](https://gitlab.com/psono/psono-client/commits/master)

# Install for "normal" people :D

## Chrome

1. Download the crx file here:

    https://gitlab.com/psono/psono-client/builds/artifacts/master/download?job=chrome-extension
    
2. Unpack the ***.zip*** into a folder of your choice ***"folder/of/your/choice"***
    
4. Open following url in your browser:

    chrome://chrome/extensions/
    
5. Click "Open unpacked extension" at the top left and choose ***"folder/of/your/choice/build/chrome"***

The extension should now be loaded


## Firefox

1. Click on the following link:

    https://gitlab.com/psono/psono-client/builds/artifacts/master/download?job=firefox-extension
    
    (You will be asked (at the top left) if you want to allow this extension to be installed which you have to permit)
    

# Install for developers

1. Install dependencies

        sudo apt-get update
        sudo apt-get install nodejs
        sudo apt-get install npm
        sudo ln -s /usr/bin/nodejs /usr/bin/node
        sudo npm install
        
2. Build Chrome and Firefox extensions

        gulp
        
    While developing you can also use the following instead, which will rebuild everything once something changes:
        
        gulp watch

3. Pack Chrome extension for release

        gulp crx

    (make sure to run gulp without parameter first)
    
    After this command you will find in ./dist/chrome/psono.PW.crx (and ./dist/chrome/psono.PW.update.xml)
        
4. Pack Firefox extension for release

        gulp xpi

    (make sure to run gulp without parameter first)
    
    After this command you will find ./dist/firefox/psono.PW.xpi (and the unsigned version
    ./dist/firefox/psono.PW.unsigned.xpi)
    
    If you do not want to create an official signed version and only want to create the unsigned version you can do:
    
        gulp xpiunsigned
        
    Only ./dist/firefox/psono.PW.unsigned.xpi will be created.
        
5. (optional) Pack chrome and firefox for release
        
    The "All In One" command is:
    
        gulp dist
        
    This command will execute gulp, gulp crx and gulp xpi


# Install for unit tests

1. Install dependencies

        sudo npm install
        sudo npm install -g karma-cli
        sudo npm install -g coffee-script
        
    If you want unit tests, that run in Chrome / Firefox, you also have to install both browsers
    
2. Run the tests

    directly from command line:

        karma start ./unittests/karma-chrome.conf.js
        
    if you want to use another browser like firefox you can also use ./unittests/karma-firefox.conf.js instead or for
    something more generic ./unittests/karma-generic.conf.js. If you use "generic" point the browser of your choice
    to the shown url.
        
    or more sexy with gulp:
    
        gulp unittest
        
    or if you want to watch for changes and run it automatically:
    
        gulp unittestwatch
    

# Documentation

More information about the code, the used cryptography and design concepts can be found in the [Documentation](docu/DOCUMENTATION.md)
    
