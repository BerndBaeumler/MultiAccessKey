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
      'Wings': {
        'Length (more than)':         [2, null],             // More than 2 mm long
        'Length (usually more than)': [null, 3, null, null], // Usually more than 3 mm long
        'Length (more than ...)':     [2, 3, 4, null],       // More than 2 mm long, usually longer than 3 mm, typically 4 mm long
        'Length (less than)':         [null, null, 6],       // Less than 6 mm long
        'Length (usually less than)': [null, null, null, 5], // Usually less than 5 mm long
        'Length (less than ...)':     [null, null, 4, 5, 6]  // Less than 6 mm long, usually less than 5 mm long, typically 4 mm long
      },
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
        'Body|Color': ['striped', ['light blue|green'], ['black'], ['white']],
        'Wings': {
          'Length (more than)':         [2, null],             // More than 2 mm long
          'Length (usually more than)': [null, 3, null, null], // Usually more than 3 mm long
          'Length (more than ...)':     [2, 3, 4, null],       // More than 2 mm long, usually longer than 3 mm, typically 4 mm long
          'Length (less than)':         [null, null, 6],       // Less than 6 mm long
          'Length (usually less than)': [null, null, null, 5], // Usually less than 5 mm long
          'Length (less than ...)':     [null, null, 4, 5, 6], // Less than 6 mm long, usually less than 5 mm long, typically 4 mm long
          'Length 3 (usually) .. 6':           [null, 3, null, null, 6], 
          'Length 2 .. 5 (usually)':           [2, null, null, 5],
          'Length (2) 3 .. 4 .. 5 (usually))': [2, 3, 4, 5],
          'Length (2) 3 .. 6':                 [2, 3, null, null, 6],
          'Length 2 .. 4 .. 5 (6)':            [2, null, 4, 5, 6],
          'Length 3 (usually) .. 4 .. 5 (6)':  [null, 3, 4, 5, 6]
        },
      }
    }
  }
});
