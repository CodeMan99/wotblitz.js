wotblitz
========

A simple command line utility to make using the
[World of Tanks Blitz](http://wotblitz.com/) API easy.

How to Install
--------------

Wotblitz is written in [nodejs](https://nodejs.org/), you must install it first.
Once you have node installed you can run `npm install -g wotblitz`, this will make
the `wotblitz` command accessable.

Usage
-----

To see an overview, do `wotblitz --help`.

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
