"use strict";

MAKey.register('Lucilia', {
  figures: {
    10199: {
      title: 'The whitish basicosta of Lucilia sericata',
      c: '(CC BY-NC) philbenstead',
      source: 'https://www.inaturalist.org/photos/163974331'
    }
  },
  
  singleAccessKey: {
    1: {
      1: {
        next: 2,
        'Basicostae|Color': ['whitish', {fig: 10199}],
        'Subcostal sclerite|Hairs|Color': [
          'yellow', 
          '(subcostal sclerite covered in microscopic hairs, good magnification and lighting required)',
          {fig: 10101}]
      },
      '2': {
        next: 3,
        'Basicostae|Color': 'black|brown',
        'Subcostal sclerite|Hairs|Color': [
          'black', 
          '(subcostal sclerite covered in hairs)',
          '(which are either long and obvious)', {fig: 10102},
          '(or microscopic)', {fig: 10101}
        ]
      }
    },
    2: {
      1: {
        taxon: 'Lucilia sericata',
        'Mid legs|Tibia|Anterodorsal bristle': 1,
        'Palpi|Color': ['orange', '(sometimes darker at tip)'],
        male: {
          distanceBetweenEyes: [1.7, 2, 2.5, 'male', {fig: 10103}],
          'Male genitalia|Hairs between surstyli and aedeagus': {
            'Amount': ['few', '(relatively few if viewed from side)', {fig: 10109}],
            'Color': ['black', '(straight black hairs)']
          }
        },
        female: {
          ratioInterfrontaliaToParafacialiaWidth: 
            [null, null, 2, '(less than twice as wide as the silvery parafrontalia)'],
          'Interfrontalia|Color': 'black',
          'Parafacialia': {
            'Color': 'silver',
            widthRelativeToThirdAntennalSegment:
              [1, null, null, '(Broader than the width of a third antennal segment)', {fig: 10116}]
          },
          'Abdomen|Dusting': ['pale grey', '(conspicuous pale grey dusting from some angles)']
        }
      },
      2: {
        taxon: 'Lucilia richardsi',
        'Mid legs|Tibia|Anterodorsal bristle': [2, '(strong)'],
        'Palpi|Color': ['dark brown|blackish', '(entirely, usually)'],
        male: {
          distanceBetweenEyes: [0.3, 0.5, 0.8, {fig: 10104}],
          'Male genitalia|Hairs between surstyli and aedeagus': {
            'Amount': ['many', '(if viewed from side)', {fig: 10110}],
            'Color': ['blackish', '(curled black hairs)']
          },
        },
        female: {
          ratioInterfrontaliaToParafacialiaWidth: 
            [2, null, null, '(more than twice as wide as the silvery parafrontalia)'],
          'Interfrontalia|Color': 'black',
          'Parafacialia': {
            'Color': 'silver',
            widthRelativeToThirdAntennalSegment: [
              null, null, 1, 
              '(With the parafacialia narrower than the width of a third antennal segment)', 
              {fig: 10117}
            ]
          },
          'Abdomen|Dusting': ['no|week', '(inconspicuously)']
        }
      }
    },
    3: {
      1: {
        next: 4,
        'Subcostal sclerite': {
          'Color': 'brown|yellowish|whitish',
          'Hairs': {
            'Color': 'black',
            'Visibility': ['clearly_visible', '(With numerous long black hairs)']
          }
        },
        'Abdomen|Color': ['metallic green', '(tergite 3 just like tergites 1 and 2 at least from some angles)'],
        male: {
          'Tergite 3': {
            ratioMedianMarginalsToTergite4Length: [0.3, 0.5, 0.7, 
              '(median marginals about half as long as the length of tergite 4', {fig: 10106}]
          }
        },
        female: {
          'Tergite 3': {
            ratioMedianMarginalsToTergite4Length: [0.1, 0.25, 0.35, 
              '(With median marginals about one-quarter as long as the length of tergite 4)']
          }
        }
      },
      2: {
        next: 6,
        'Subcostal sclerite': {
          'Color': 'dark brown|blackish',
          'Hairs': {
            'Color': 'black',
            'Visibility':  ['microscopic', '(With a covering of microscopic black hairs)']
          }
        },
        'Tergite 1|Color': ['blackish', '(contrasting markedly with tergite 3 in all angles of view)'],
        'Tergite 2|Color': ['blackish', '(contrasting markedly with tergite 3 in all angles of view)'],
        'Tergite 3|Color': 'metallic green',
        male: {
          'Tergite 3': {
            ratioMedianMarginalsToTergite4Length: [0.8, 1, 1.3, 
              '(median marginals nearly as long as the length of tergite 4', {fig: 10107}]
          }
        },
        female: {
          'Tergite 3': {
            ratioMedianMarginalsToTergite4Length: [0.4, 0.5, 0.7,
              '(median marginals half as long as the length of tergite 4)']
          }
        }
      }
    },
    4: {
      1: {
        taxon: 'Lucilia ampullacea',
        'Coxopleural streak': ['no', '(angle of view and lighting critical)', {fig: [[10108, 'compare']]}],
        male: {
          'Male genitalia': {
            'Hairs between surstyli and aedeagus': {
              'Amount': ['many', '(if viewed from side)', {fig: 10112}],
              'Color': ['blackish', '(curled black hairs)']
            },
            'Surstyli': ['broad', 'blunt', '(if viewed from side)', {fig: 10112}]
          },
          distanceBetweenEyes: [0.3, 0.5, 0.7, '(the whitish orbits almost touching)', {fig: 10105}]
        },
        female: {
          'Antennal segment 3': {
            lengthRelativeToWidthOfFrons: [0.9, 1, 1.2, '(Almost as long as the width of the frons)']
          }
        }
      },
      2: {
        next: 5,
        'Coxopleural streak': ['greyish', '(angle of view and lighting critical)', {fig: [10108]}],
        'Male genitalia|Hairs between surstyli and aedeagus|Amount':
          ['few', '(if viewed from side)', {fig: [10111, 10113]}],
        'Antennal segment 3': {
          lengthRelativeToWidthOfFrons: [0.5, 0.75, 0.85, '(length about 0.75 the width of the frons)', 'female']
        }
      }
    },
    5: {
      1: {
        taxon: 'Lucilia caesar',
        male: {
          distanceBetweenEyes:
            [null, null, 0.7, '(very narrowly separated, the whitish orbits almost touching)', {fig: 10105}],
          'Male genitalia': {
            'Capsule': ['large', 'bulbous', '(even when in normal folded position)', {fig: [10118]}],
            'Figure': 10111
          }
        },
        female: {
          femaleEndTergite6: {
            'Dorsal edge': ['convex', '(when viewed from the side)', {fig: 10119}],
            'Apical bristles': [
              'different_length',
              '(long bristles laterally but much shorter ones dorsally in the middle)', 
              '(the ovipositor needs to be extracted to see this)',
              {fig: 10119}
            ]
          }
        }
      },
      2: {
        taxon: 'Lucilia illustris',
        male: {
          distanceBetweenEyes:
            [0.8, 1, null, 
              '(about the width of a third antennal segment)',
              '(the whitish orbits clearly separated by a black interfrontalia)',
              {fig: 10104}
            ],
          'Male genitalia': {
            'Capsule': ['smaller', {fig: [10118, 'compare']}],
            'Figure': 10113
          }
        },
        female: {
          femaleEndTergite6: {
            'Dorsal edge': ['plane', '(straight when viewed from the side)', {fig: 10120}],
            'Apical bristles': [
              'long',
              '(a complete row of long bristles)', 
              '(the ovipositor needs to be extracted to see this)',
              {fig: 10120}
            ]
          }
        }
      }
    },
    6: {
      1: {
        taxon: 'Lucilia silvarum',
        'Postsutural acrostichals': 3,
        'Male genitalia|Surstyli': ['long', 'narrow', {fig: 10114}],
        ratioFronsToHeadWidth: [0.33, null, null,
          '(frons at least one-third the width of the head)']
      },
      2: {
        taxon: 'Lucilia bufonivora',
        'Postsutural acrostichals': [2, 'usually', 'TO BE CHECKED'],
        'Male genitalia|Surstyli': ['short', 'blunt', '(relatively short and blunt)', {fig: 10115}],
        ratioFronsToHeadWidth: [null, null, 0.33,
          '(frons slightly less than one-third the width of the head)']
      }
    }
  }
});
