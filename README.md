# MultiAccessKey / maKey
A JavaScript framework to create single-access and multi-access keys which allow users to identify biological organisms based on its characteristics.

Keys are created using JavaScript. The keys can be stored and executed on a server or locally. They should be work in various modern web browsers. The framework is tested with Google Chrome.

To try out the framework please create a local copy of the repository and run the file "public/maKey.html". This demo includes an experimental key to some flies.

The file "public/maKeyBasicTest.html" is more suitable to try out the basic functionality of the framework. This key contains only three dummy organisms.

## The main screen
The following screenshot shows the main screen of maKey with a multi-access key.

![Sreenshot](docs/assets/maKey.jpg)

The main screen of maKey contains four windows. These windows are marked with red numbers in the screenshot above. For a multi-access key the content of these windows is:  
1. A tree with the available characters and intput fields to specify the character of the organism to be identified 
2. A list with the taxons witch are matching the characters specified above
3. Information about the currently selected character or taxon
4. A description of the characters related to the taxon that was last selected 

## Dependencies
maKey includes a modified version of
- split.js from https://github.com/nathancahill/split/tree/v1.3.5

