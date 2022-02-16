# Creating keys

## Introduction
Keys for maKey must be specified in JavaScript files. Per convention keys shall be stored in the `pulbic/data` folder.

### Single-access keys
Many of the keys available in the literature are single-access keys.
If a single-access key is converted into the maKey input format it can be displayed by maKey as
single-access or multiple-access key.

The following JavaScript code defines and registers a key which can be used as single-access or multiple-access key.
It is a simplified and annotated version of the file `pulbic/data/Lucilia.js`.

```
MAKey.register('Lucilia', {
  singleAccessKey: {
    1: {
      1: {    // Definition of option "Lucilia 1.1"
        next: 2,
        'Basicostae|Color': ['whitish', {fig: 10199}],
        'Subcostal sclerite|Hairs|Color': ['yellow', {fig: 10101}]
      },
      2: {    // Definition of option "Lucilia 1.2"
        taxon: 'Lucilia (not covered by this key)',
        'Basicostae|Color': 'black|brown',
        'Subcostal sclerite|Hairs|Color': 'black'
      }
    },
    2: {
      1: {    // Definition of option "Lucilia 2.1"
        taxon: 'Lucilia sericata',
        'Palpi|Color': ['orange', '(sometimes darker at tip)']
      },
      2: {    // Definition of option "Lucilia 2.2"
        taxon: 'Lucilia richardsi',
        'Palpi|Color': 'dark brown|blackish']
      }
    }
  }
});
```

The code `next: 2` defines a jump to the next question. 
After the user selects the option "Lucilia 1.1" maKey asks the user to choose between option
"Lucilia 2.1" and "Lucilia 2.2".

The code `taxon:` is the keyword to specify the name of a taxon or describe a taxonomic group.

The other parts of the example describe characters to distinguish taxons.
The specification of characters is described below.

### Multi-access keys and supplementary taxon descriptions
The following JavaScript code defines and registers a key with one taxon.
This syntax is primarily suitable to specify characters of a taxon which are not specified as part of
an underlying single-access key.
In addition, the syntax is suitable to specify a multi-access key without supporting a related single-access key.

```
MAKey.register('Stomorhina', {
  taxons: {
    'Stomorhina lunata': {    // The name of a taxon
      'Body': {               // Characters which describe the body of the taxon
        'Length [mm]': [3.3, 4, null, 5, 5.6],
        'Bristles': 2
      },
      female: {               // Characters of females
        'Body|Color': 'turquoise',
        fig: 10099            // A link to a photo of a Stomorhina lunata female
      },
      male: {                 // Characters of males
        'Body|Color': 'blue'
      }
    }
  }
});
```

## Working with characters
Characters are used to distinguish between taxons and taxonomic groups. 
Examples for a colloquial formulation of a character are:
- Body length between 4 and 6 mm.
- The head is red.

The formal parts of a character are:
- A body part (like "head")
- A character category (like "length" or "color" which is is often not explicitly mentioned in a colloquial formulation)
- A value or value range (like "red" or "4 to 6 mm") 

