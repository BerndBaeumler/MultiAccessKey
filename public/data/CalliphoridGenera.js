"use strict";

MAKey.register('Calliphorid genera', {
  figures: {
    10099: {
      caption: 'Stomorhina lunata, female',
      c: '(CC BY-NC) Marie Lou Legrand',
      source: 'https://www.inaturalist.org/photos/159339502'
    }
  },
  
  taxons: {
    'Stomorhina lunata': {
      female: {fig: 10099}
    }
  },
  
  singleAccessKey: {
    1: {
      1: {
        next: 2,
        'Stem vein': 1,
        'Lower calypters|Inner edge': 1
      },
      2: {
        next: 5,
        'Stem vein': 2,
        'Lower calypters|Inner edge': 2
      }
    },
    2: {
      1: {
        taxon: 'Stomorhina lunata',
        'Body|Color': 'non-metallic',
        'Lower face': 1,
        'Mesonotum|Color': ['striped', ['grey'], ['black']],
        'Tergite 2|Patches': ['laterally large orange', 'male'],
        'Tergite 3|Patches': ['laterally large orange', 'male']
      },
      2: {
        next: 3,
        'Body|Color': 'metallic blue|metallic green',
        'Lower face': 2
      }
    },
    3: {
      1: {
        taxon: 'Protophormia terraenovae',
        acrostichalsComparedWithHairsOfMesonotum: 1,
        'Calypters': {
          'Color': 'light grey-brown',
          'Rim': 'darker brown'
        },
        'Body|Color': 'dark metallic blue',
        'Mesonotum|Dusting': 'no|weak'
      },
      2: {
        next: 4,
        acrostichalsComparedWithHairsOfMesonotum: 2,
        'Calypters': {
          'Color': ['whitish|yellowish-grey', '(though the hair fringe these give rise to may be darker)'],
          'Rim': '(usually not much darker)'
        },
        'Body|Color': ['dark metallic blue', '(with green-turquoise reflections)'],
        'Mesonotum|Dusting': ['yes', '(obvious pale dusting at least at the front when viewed from behind)']
      }
    },
    4: {
      1: {
        taxon: 'Protocalliphora azurea',
        'Lower calypters|Inner edge': 3,
        acrostichalsComparedWithLengthOfScutellum: 1,
        'Antennae|Color': 'blackish|brownish',
        'Basicostae|Color': 'blackish|brownish',
        'Anterior thoracic spiracles|Color': 'blackish|brownish',
        distanceBetweenEyes: [1.2, 1.5, 1.8, 'male'],
      },
      2: {
        taxon: 'Phormia regina',
        'Lower calypters|Inner edge': -3,
        acrostichalsComparedWithLengthOfScutellum: 2,
        'Antennae|Color': ['pale brown|orange', 'reddish (partly)'],
        'Basicostae|Color': 'pale brown|orange',
        'Anterior thoracic spiracles|Color': 'pale brown|orange',
        distanceBetweenEyes: [0.3, 0.5, 0.8, 'male']
      }
    },
    5: {
      1: {
        next: 6,
        'Vein M': 1,
        'Body|Built': 'robustly-built'
      },
      2: {
        next: 13,
        'Vein M': 2,
        'Body|Built': ['slimly-built', '(slim, non-metallic, small or very small species)']
      }
    },
    6: {
      1: {
        next: 7,
        'Abdomen|Color': 'metallic green|metallic blue'
      },
      2: {
        next: 11,
        'Abdomen': {
          'Color': 'non-metallic',
          'Dusting': ['yes', '(strongly patterned by dusting)']
        }
      }
    },
    7: {
      1: {
        taxon: 'Lucilia',
        'Body': {
          'Color': 'bronze|metallic green|metallic turquoise',
          'Dusting': ['weak', '(barely obscuring the underlying coloration)']
        },
        'Suprasquamal ridge': 1
      },
      2: {
        next: 8,
        'Body': {
          'Color': 'non-metallic',
          'Dusting': ['yes', '(with some obvious dusting at least at thorax)']
        },
        'Suprasquamal ridge': 2
      }
    },
    8: {
      1: {
        taxon: 'Melinda',
        'Lower calypters|Hairs on upper surface': 1,
        'Genae|Depth': 1
      },
      2: {
        next: 9,
        'Lower calypters|Hairs on upper surface': 2,
        'Genae|Depth': 2
      }
    },
    9: {
      1: {
        taxon: 'Cynomya mortuorum',
        'Postsutural acrostichals': 1,
        'Face|Color': ['yellow|orange', '(mostly)'],
        'Genae|Color': ['yellow|orange', '(mostly)'],
        'Frons|Color': ['yellow|orange', '(mostly)'],
        'Abdomen': {
         'Color': ['metallic (dark) blue|metallic (dark) turquoise', '(brightly shining)'],
         'Dusting': ['no', '(entirely undusted)']
        },
        'Tergite 4|Bristles': [1, 'female'],
        'Tergite 5|Bristles': [2, 'female'],
        'Male genitalia': 1
      },
      2: {
        next: 10,
        'Postsutural acrostichals': 2
      }
    },
    10: {
      1: {
        taxon: 'Calliphora',
        'Abdomen|Color': 'metallic blue',
        'Parafacialia': 1,
        'Antennal segment 3|Ratio of length to wide': [3, null, 5, '(3-5 times as long as wide)']
        // Face, frons and genae often extensively yellow, orange or reddish
      },
      2: {
        taxon: 'Bellardia',
        'Abdomen|Color': 'bronze|metallic green|metallic turquoise',
        'Parafacialia': 2,
        'Antennal segment 3|Color': ['red', '(at most at extreme base)'],
        'Antennal segment 3|Ratio of length to wide': [2, null, 2.5, '(2-2.5 times as long as wide)']
        // Lower calypters only hairy over about one-third of their upper surface, broadly bare around their margins (Fig 16)
        // Face, frons and genae entirely or mainly dark
      }
    },
    11: {
      1: {
        taxon: 'Pollenia',
        'Thorax|Hairs|Color': ['golden|yellowish',
          '(with wavy golden or straw-coloured hairs somewhere on the thorax, often rubbed off the dorsal surface but in this instance visible somewhere on the sides)']
      },
      2: {
        next: 12,
        'Thorax|Hairs|Color': ['NOT', 'golden|yellowish']
      }
    },
    12: {
      1: {
        taxon: 'Eurychaeta palpalis',
        'Parafacialia|Bristles': [3, '(at lower part)', {fig: 10017}],
        'Mesonotum|Bristles': 3,
        'Abdomen|Bristles': 3,
        'Costal bristle': 2
      },
      2: {
        taxon: 'Bellardia pubicornis',
        'Parafacialia|Bristles': -3,
        'Mesonotum|Bristles': -3,
        'Abdomen|Bristles': -3,
        'Costal bristle': 1
      }
    },
    13: {
      1: {
        taxon: 'Eggisops pecchiolii',
        'Scutellar marginal bristles|Number of pairs':
          [2, '(strong, in addition to the apicals)', {fig: 10018}],
        'Propleural depression|Seate': 'yes',
        'Lunula|Seate': 'yes',
        'Notopleuron|Fine hairs': ['yes', '(in addition to the two bristles)'],
        'Wings|Length [mm]': [4.5, null, 6]
      },
      2: {
        next: 14,
        'Scutellar marginal bristles|Number of pairs':
          [1, '(much longer than the apicals)', {fig: 10019}],
        'Propleural depression|Seate': 'no',
        'Lunula|Seate': 'no',
        'Notopleuron|Fine hairs': ['no', '(only two bristles)'],
        'Wings|Length [mm]': [null , null, 4]
      }
    },
    14: {
      1: {
        taxon: 'Melanomya nana',
      },
      2: {
        taxon: 'Angioneura',
      }
    }
  }
});

/*
14a  Melanomya nana
Arista
 Plumose
Parafacialia
 With fine setae
Prealar bristle
 Much stronger than the hind notopleural
Halteres
 Dark

14b  Angioneura
Arista
 Pubescent
Parafacialia
 NOT With fine setae
Prealar bristle
 Not longer than the hind notopleural
Halteres
 Yellow
*/

