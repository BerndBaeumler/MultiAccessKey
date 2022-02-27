"use strict";

var MAKey = MAKey || {};

MAKey.bodyPartDefs = {
  legParts: ['Coxa', 'Trochanter', 'Femur', 'Tibia', 'Tarsal segments', 'Claws']
};

MAKey.bodyParts = {
  main: ['Wings', 'Legs', 'Head', 'Body'],
  'Wings': ['Calypters', 'Basicostae', 'Subcostal sclerite', 'Stem vein', 'Vein M', 'Costal bristle'],
    'Calypters': ['Lower calypters'],
  'Legs': ['Front legs', 'Mid legs', 'Hind legs'],
    'Front legs': MAKey.bodyPartDefs.legParts,
    'Mid legs': MAKey.bodyPartDefs.legParts, 
    'Hind legs': MAKey.bodyPartDefs.legParts,
  'Head': [ 
    'Oral opening', 'Mouthparts', 'Face',
    'Eyes', 'Antennae', 'Lunula', 'Frons', 'Occiput', 'Genae', 'Genal dilation', 
  ],
    'Mouthparts': ['Palpi'],
    'Face': ['Parafacialia', 'Lower face'],
    'Antennae': ['Antennal segment 1', 'Antennal segment 2', 'Antennal segment 3', 'Arista'],
    'Frons': ['Parafrontalia', 'Interfrontalia'],
  'Body': ['Thorax', 'Abdomen'],  
    'Thorax': ['Hairs', 'Mesonotum', 'Notopleuron', 'Propleuron',
      'Coxopleural streak', 'Anterior thoracic spiracles', 'Suprasquamal ridge'],
    'Mesonotum': ['Scutellum',
      'Acrostichal bristles', 'Dorsocentral bristles',
      'Intra-alar bristles', 'Supra-alar bristles', 'Humeral bristles'
    ],
      'Intra-alar bristles': ['Presutural intra-alar bristles'],
      'Acrostichal bristles': ['Postsutural acrostichals'],
      'Scutellum': ['Subscutellum'],
      'Humeral bristles': ['Outer posthumeral bristle'],
    'Propleuron': ['Propleural depression'],
  'Abdomen': [
    'Bristles', 'Tergite 1', 'Tergite 2', 'Tergite 3', 'Tergite 4', 'Tergite 5', 'Tergite 6',
    'Sternite 5',
    'Male genitalia'
  ]
};


MAKey.basicCharacters = {
  built: ['robustly-built', 'slimly-built'],
  shape: [
    'blunt',   // stumpf
    'bulbous', // bauchig
    'narrow'   // schmal
  ],
  curvature: [
    'plane',  // eben, gerade
    'convex',
    'concave'
  ],
  length: ['different_length'],


  truthValues: ['no', 'weak', 'yes'],
  amount: ['none', 'few', 'many'],
  
  position: ['laterally'],
  visibility: ['clearly_visible', 'microscopic'],
  width: ['slim', 'broad'],
  size:  ['large', 'small'],
  
  pattern: ['striped', 'curled', 'patched'],

  strictColors: ['metallic'],
  relativeColors: ['lighter', 'darker'],
  colorModifiers: ['light', 'dark'],
  colors: [
    ['white', 'whitish'],
    ['black', 'blackish', 'grey'],
    ['brown', 'brownish', 'grey-brown'],
    ['blue', 'bluish', 'turquoise'],
    ['green', 'greenish', 'olive'],
    ['red', 'reddish', 'orange'],
    ['yellow', 'yellowish', 'yellowish-grey'],
    ['bronze', 'gold', 'silver']
  ]
};

MAKey.inputRules = {
  combinations: [
    { singleChoice: 'truthValues amount position visibility width size',
      multipleChoiceSelector: 'pattern',
      multipleChoice: 'relativeColors colorModifiers colors'
    }
  ],
  withoutInput: ['NOT', 'non-metallic', 'male', 'female'],
  globalTypes: ['pattern'],
  strictTypes: ['strictColors']
};

MAKey.CharacterValues.init();
