# maKey Programming Guide
maKey is a JavaScript framework to create single-access and multi-access keys which allow users to identify biological organisms based on its characteristics.

Keys are created using JavaScript.
[docs/maKeyCreatorManual.md](docs/maKeyCreatorManual.md) gives further information on creating keys.

## Basic requirements
It shall be possible to stored and executed keys on a server or locally.

maKey shall work in modern web browsers.

maKey shall be tested with Google Chrome.

## Structure of the source code

### The main file maKey.html
The main file of maKey applications is a html file.
Currently every key has its own main file.
The standard main file of this repository is the file "public/maKey.html".
It is the main file of a demo with an experimental key to some flies.
The repository contains other main files which are used for testing.

### lib/maKey.css

### split.js
maKey includes a modified version of
- split.js from https://github.com/nathancahill/split/tree/v1.3.5

Files:
- public/lib/split/split.css
- public/lib/split/split.js

### lib/maKeyBase.js

### Files to specify keys
Per convention the specification of keys shall be stored in the `pulbic/data` folder.

Files with universal definitions:
- public/data/basicCharacters.js
- public/data/characterDescriptions.js

There are no naming conventions for key-specific files.
This repository contains the following key-specific files:
- public/data/CalliphoridGenera.js
- public/data/Lucilia.js

[docs/maKeyCreatorManual.md](docs/maKeyCreatorManual.md) gives further information on creating keys.

### public/lib/maKeyBrowser.js
Initalizes the used windows, supports the selection of windows and implements the global menu.

### public/lib/multiAccessKey.js
Implements the user interface for a multi-access key.

### public/lib/singleAccessKey.js
Implements the user interface for a single-access key.

### public/lib/smartTree.js
CSS file:
- public/lib/smartTree.css

### public/lib/taxonsTree.js

### public/lib/characterTree.js

### public/lib/enumPicker.js
CSS file:
- public/lib/enumPicker.css

## Testing
The file "public/maKeyBasicTest.html" is a key which contains only three dummy organisms.
It can be used to test and debug the basic functionality of the framework.
