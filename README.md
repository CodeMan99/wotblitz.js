wotblitz [![Build Status](https://travis-ci.org/CodeMan99/wotblitz.js.svg?branch=master)](https://travis-ci.org/CodeMan99/wotblitz.js)
========

A simple command line utility to make using the
[World of Tanks Blitz](http://wotblitz.com/) API easy.

How to Install
--------------

Wotblitz is written in [nodejs](https://nodejs.org/), you must install it first.
Once you have node installed you can run `npm install -g wotblitz`, this will make
the `wotblitz` command accessible.

Usage
-----

To see an overview, do `wotblitz --help`.

As a dependency
---------------

You can `npm install wotblitz --save` to use this package as a library. Provide your
own application_id by setting `APPLICATION_ID` in your environment.

    $ export APPLICATION_ID=myapplicationid
    $ head -n 1 myapp.js
    var wotblitz = require('wotblitz');

A function is returned to set the application_id if none is found in the environment.

    $ head -n 1 myapp.js
    var wotblitz = require('wotblitz')('myapplicationid');

You may also use the application itself as a dependency. Useful if you are writing a
project that is not node.

    $ APPLICATION_ID=myapplicationid wotblitz servers | myapp.sh

Note the reason to have your own `APPLICATION_ID` is so that you can release your
code. If you intend just release the data, then you are within the bounds of the
terms Wargaming has setup. If you are unsure, please read the agreement yourself.

Limitations
-----------

All data is pulled directly from Wargaming's API for World of Tanks. When in-game
items are missing (like a new tank line) it is due to the fact that Wargaming does
not update their API very often. Missing data is out of the control of this
application. Any ticket created on this topic will be closed with a "wont fix" label.

[License](LICENSE.md)
---------------------

This project uses the Internet Software Consortium (ISC) license unless otherwise
stated at the top of a file.

More Resources
--------------

* [Wargaming.net developer room](https://na.wargaming.net/developers/)
* [Online tankopedia](http://wotblitz.com/encyclopedia/vehicles/)
* [Community wiki](http://wiki.wargaming.net/en/WoT_Blitz)
* [Community forum](http://forum.wotblitz.com/)
