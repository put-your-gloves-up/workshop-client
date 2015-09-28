# Jerek0 Starter

## How to
Clone the repo using the command :

    git clone https://github.com/Jerek0/jerek0-starter.git
    
Make sure you have Gulp installed

    npm install gulp -g
    
Open your terminal at the root of the projet and launch the following to work on the project :

    npm install
    gulp
    
It will open your default browser on http://localhost:3000/. Finally, you can access browser-sync options by reaching http://localhost:3001/.
    
## Structure

### src
Source files are stored in the src folder in separate directories (js / css / htdocs). 
Gulp will watch these files and compile them all everytime a file is modified;

### build 
Compiled files are stored there. This folder is our final product, you can access it by http://localhost:3000/ in your browser

### gulp
Automation scripts
