/**
 * Created by jerek0 on 06/05/2015.
 */
var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
