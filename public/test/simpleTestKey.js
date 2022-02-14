"use strict";

MAKey.register('Test striped', {
  figures: {
    10099: {
      caption: 'Stomorhina lunata, female',
      c: '(CC BY-NC) Marie Lou Legrand',
      source: 'https://www.inaturalist.org/photos/159339502'
    }
  },
  
  taxons: {
    'Stomorhina lunata': {
      female: {
        'Body': {
          'Color': 'turquoise',
          'Length [mm]': [3.3, 4, null, 5, 5.6],
          'Bristles': 2
        },
        fig: 10099
      }
    }
  },
  
  singleAccessKey: {
    1: {
      1: {
        taxon: 'STRIPED dark red AND black OR yellow|orange AND grey',
        'Body|Color': ['VARIANTS', 
          ['striped', ['dark red'], ['black']], 
          ['striped', ['yellow|orange'], ['grey']]
        ]
      },
      2: {
        taxon: 'STRIPED dark blue|green AND black AND white',
        'Body|Color': ['striped', ['light blue|green'], ['black'], ['white']]
      }
    }
  }
});
