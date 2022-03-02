"use strict";

var MAKey = MAKey || {};

MAKey.keys = {};
MAKey.characterDescriptions = {};
MAKey.characterByPath = {};
MAKey.characterById = [];
MAKey.characterSets = {};
MAKey.taxons = {};


MAKey.getCharacterTitle = function (characterPath) {
  return (MAKey.characterDescriptions[characterPath] && MAKey.characterDescriptions[characterPath].title) ?
    MAKey.characterDescriptions[characterPath].title : characterPath;
}


MAKey.CharacterValues = class CharacterValues {

  static values = {};
  static valuesInBasisCharcter = {};
  static valuesInCombination = [];
  
  static init() {
    let values = CharacterValues.values;

    function register(bcName, id) {
      let bc = MAKey.basicCharacters[bcName];
      let basicCharacter = (Array.isArray(bc[0])) ? bc : [bc];
      let flatBC = [];
      basicCharacter.forEach(row => {
        row.forEach(val => {
          values[val] = values[val] || [];
          values[val].push(id);
          flatBC.push(val);
        });
      });
      return CharacterValues.valuesInBasisCharcter[bcName] = (Array.isArray(bc[0])) ? flatBC : bc;
    }

    for (let bcName in MAKey.basicCharacters) {
      register(bcName, bcName);
    }
    MAKey.inputRules.combinations.forEach((combination, idx) => {
      CharacterValues.valuesInCombination[idx] = [];
      ['singleChoice', 'multipleChoiceSelector', 'multipleChoice'].forEach(inputType => {
        if (combination[inputType]) {
          let parts = combination[inputType].split(' ');
          parts.forEach(bcName => {
            let bc = MAKey.basicCharacters[bcName];
            if (!bc) {
              console.log('ERROR Unknown name of basic character', bcName);
            } else {
              let flatValues = register(bcName, idx);
              CharacterValues.valuesInCombination[idx].push(...flatValues);
            }
          });
        }
      });
    });
    
    function expandTypes(inTypes) {
      let res = [];
      inTypes.forEach(bcName => {
        let bc = MAKey.basicCharacters[bcName];
        if (!bc) {
          console.log('ERROR Unknown name of basic character', bcName);
        } else {
          res.push(...bc);
        }
      });
      return res;
    }
      
    CharacterValues.strictValues = expandTypes(MAKey.inputRules.strictTypes);
    CharacterValues.globalValues = expandTypes(MAKey.inputRules.globalTypes);
  }
  
  static getInputRule(characterId) {
    let chr = MAKey.characterById[characterId];
    let cmbId = 0;
    let valuesInCmb = CharacterValues.valuesInCombination[cmbId];
    let additionalBasicCharacterNames = {};
    for (let val in chr.values) {
      if (!valuesInCmb.includes(val)) {
        additionalBasicCharacterNames[CharacterValues.values[val][0]] = true;
      }
    }
    return {
      character: chr,
      values: chr.values,
      inputCombination: MAKey.inputRules.combinations[cmbId],
      additionalBasicCharacterNames: Object.keys(additionalBasicCharacterNames)
    }
  }
  
}


MAKey.Parser = class Parser {

  static parseCharacter(charDesc, characterPath) {
    
    function getMeta(desc) {
      let meta;
      desc.forEach(el => {
        if (!Array.isArray(el) && (typeof el === 'object')) {
          meta = el;
        }
      });
      return meta;
    }
    
    if (!Array.isArray(charDesc)) {
      charDesc = [charDesc];
    }
    let res = {
      desc: charDesc,
      meta: getMeta(charDesc),
      negation: ''
    };
    let d0 = charDesc[0];
    if (typeof d0 == 'number') {
      if (d0 < 0) {
        res.negation = 'NOT ';
        d0 = -d0;
      }
      let cd = MAKey.characterByPath[characterPath].desc;
      cd = (cd) ? cd[d0] : null;
      if (cd) {
        if (!Array.isArray(cd)) {
          cd = [cd];
        }
        res.globalDesc = cd;
        res.globalDescMeta = getMeta(cd);
      } else {
        res.negation = '';
      }
    }
    return res;
  }

  static appendDisplayData(result, charDesc, replaceOR) {

    function appendDescription(res, desc, numbersAreAllowed) {
      res.notes = res.notes || [];
      res.strings = res.strings || [];
      res.parameters = res.parameters || [];
      res.numbers = res.numbers || [];
      res.meta = res.meta || {};
      for (let i = 0; i < desc.length; i++) {
        let d = desc[i];
        if (typeof d === 'string') {
          if (d.startsWith('(') && d.endsWith(')')) {
            res.notes.push(d.substr(1, d.length-2));
          } else {
            res.strings.push((replaceOR) ? d.replaceAll('|', ' or ') : d);
          }
        } else if (d === null || d === undefined || typeof d === 'number') {
          if (numbersAreAllowed) {
            res.numbers.push(d);
          } else {
            console.log('ERROR Found forbidden number in character description.');
          }
        } else if (typeof d === 'object') {
          if (Array.isArray(d)) {
            let r = appendDescription({}, d, false);
            res.parameters.push(r);
          } else {
            Object.assign(res.meta, d);
          }
        } else {
          console.log('ERROR Unexpected type in character description:', typeof d);
        }
      }
      let n = res.numbers.length;
      if (n > 1) {
        if (n > 5) {
          console.log('ERROR Wrong quantity of ', n, 'numbers in character description.');
        }
        if (n < 4) {
          let nums = [res.numbers[0], null, res.numbers[1], null, res.numbers[2]];
          res.numbers = nums;
        }
      }
      return res;
    }
    
    appendDescription(result, charDesc, true)
    return result;
  };

  static variantToText (desc, charPath) {
    
    function buildText(displayData) {
      let txt = '';
      let nums = displayData.numbers;

      function appendNumber(id, prefix, suffix) {
        if (nums[id]) {
          if (txt && prefix.length > 4) {
            txt = txt + ', ';
          }
          txt = txt + (prefix) + nums[id] + (suffix || '');
        }
      }
      
      if (nums.length > 1) {
        let min = nums[0] || nums[1];
        let max = nums[3] || nums[4];
        if (min && max) {
          if (nums[1]) {
            appendNumber(0, '(', ') ');
            appendNumber(1, '');
          } else {
            appendNumber(0, '');
          }
          appendNumber(2, ' .. ');
          if (nums[3]) {
            appendNumber(3, ' .. ');
            appendNumber(4, ' (', ')');
          } else {
            appendNumber(4, ' .. ');
          }
        } else {
          if (min) {
            appendNumber(0, 'greater than ');
            appendNumber(1, 'usually greater than ');
          }
          if (max) {
            appendNumber(4, 'less than ');
            appendNumber(3, 'usually less than ');
          }
          appendNumber(2, 'typically ');
        }
      }
      if (displayData.strings.length) {
        let s = displayData.strings.join(', ');
        s = s.replace('NOT, ', 'NOT ');
        if (displayData.parameters.length) {
          s = s + ' ' + buildText(displayData.parameters[0]);
          for (let i = 1; i < displayData.parameters.length; i++) {
            s = s + ' AND ' + buildText(displayData.parameters[i]);
          }
        }
        if (txt) {
          displayData.notes.unshift(s);
        } else {
          txt = s;
        }
      }
      if (displayData.notes.length) {
        txt = txt + ' (' + displayData.notes.join('; ') + ')';
      }
      return txt;
    }

    let displayData = {};
    let c = Parser.parseCharacter(desc, charPath);
    if (c.globalDesc) {
      Parser.appendDisplayData(displayData, c.globalDesc, true);
    }
    Parser.appendDisplayData(displayData, c.desc, true);
    return c.negation + buildText(displayData);
  }
  
  static characterToText(charDesc, charPath) {
    let valueText;
    if (charDesc.src || (Array.isArray(charDesc) && charDesc.length === 1)) {
      valueText = Parser.variantToText(charDesc.src || charDesc[0].src, charPath);
    } else {
      for (let i = 0; i < charDesc.length; i++) {
        valueText = (valueText) ? valueText + '\n' : '';
        valueText = valueText + 'Variant ' + (i + 1) + ': ' +
          Parser.variantToText(charDesc[i].src, charPath);
      }
    }
    return valueText;
  }
}


MAKey.register = function (keyName, keyDesc) {
  var keyEntityId, keyOptName, deltaCharSets, isCommon;
  
  function stringsToValues(res, character, strings, resPartId) {
    if (strings.length) {
      character.values = character.values || {};
      let defVariants = strings[0].split('|');
      defVariants.forEach(defVariant => {
        let resVariant = {};
        let defVarValues = defVariant.split(' ');
        defVarValues.forEach(dVal => {
          if (dVal[0] !== '(') {
            if (!MAKey.inputRules.withoutInput.includes(dVal)) {
              resVariant[dVal] = true;
              character.values[dVal] = true;
            }
            if (MAKey.CharacterValues.strictValues.includes(dVal)) {
              resVariant.strict = resVariant.strict || [];
              resVariant.strict.push(dVal);
            } 
            if (MAKey.CharacterValues.globalValues.includes(dVal)) {
              res.global = dVal;
            }
          }
        });
        if (Object.keys(resVariant).length) {
          // console.log(res.global + '; ' + resPartId + ': ' + Object.keys(resVariant).join(', '));
          resVariant.partId = resPartId;
          res.push(resVariant);
        }
      });
    }
  }
  
  function registerCharacter(charSet, source, character) {
    if (!Array.isArray(source)) {
      source = [source];
    }
    let data = MAKey.Parser.appendDisplayData({}, source);
    let type, value;    
    switch (data.numbers.length) {
      case 0:
        value = [];
        stringsToValues(value, character, data.strings, -1);
        for (let id = 0; id < data.parameters.length; id++) {
          stringsToValues(value, character, data.parameters[id].strings, id);
        }
        if (value.length) {
          type = 'enum';
        } else {
          value = null;
        }
        break;
      case 1:
        type = 'desc';
        value = data.numbers[0];
        break;
      default:
        type = 'number';
        value = data.numbers;
    }
    if (type) {
      character.type = character.type || type;
      if (type !== character.type) {
        console.log('ERROR Redefined type in ' + keyOptName);
      } else {
        let res = {
          src: source,
          val: value
        };
        let cid = character.id;
        if (type === 'enum') {
          charSet[cid] = charSet[cid] || [];
          charSet[cid].push(res);
        } else {
          charSet[cid] = res;
        }
      }
    }
  }

  // Builds character sets from the current and the previous character sets.
  // Stores them for later use.
  function storeCharSets(keyOpt, taxonName, taxonDesc) {
    let updatedCharSets = {};
    let pre = {};
    let preTaxon = MAKey.taxons[keyName] || {};
    let preEntityId = keyName + keyEntityId;
    ['common', 'male', 'female'].forEach(sex => {
      if (keyOpt) {
        // Read a character set from the previous key entity.
        if (keyEntityId == 1) {
          if (preTaxon[sex] && preTaxon[sex].charSet) {
            pre[sex] = preTaxon[sex].charSet;
          }
        } else {
          // The flat structure allows easy debugging.
          let pcs = MAKey.characterSets[preEntityId + sex];
          if (pcs) {
            pre[sex] = pcs;
          }
        }
      } else {
        if (MAKey.taxons[taxonName] && MAKey.taxons[taxonName][sex]) {
          pre[sex] = MAKey.taxons[taxonName][sex].charSet || {};
        } else {
          pre[sex] = {};
        }
      }
      if ((sex === 'common') || pre[sex] || deltaCharSets[sex]) {
        // Update a character set.
        let p = pre[sex] || {};
        let d = deltaCharSets[sex] || {};
        updatedCharSets[sex] = Object.assign({}, p, d);
        // Store the update a character set.
        taxonName = taxonName || keyOpt.taxon;
        if (taxonName) {
          let cs = (sex === 'common') ? updatedCharSets[sex] :
            Object.assign({}, updatedCharSets.common, updatedCharSets[sex]);
          if (Object.keys(cs).length || taxonDesc[sex]) {
            let taxon = MAKey.taxons[taxonName] = MAKey.taxons[taxonName] || {};
            taxon[sex] = taxon[sex] || {};
            if (taxonDesc && taxonDesc[sex]) {
              Object.assign(taxon[sex], taxonDesc[sex]);
            }
            taxon[sex].charSet = cs || {};
          }
        }
        if (keyOpt && keyOpt.next) {
          MAKey.characterSets[keyName + keyOpt.next + sex] = updatedCharSets[sex];
        }
      }
    });
  }
  
  function registerSubKeyOpt(charSet, subKeyOpt, characterPathBase) {
    if (Array.isArray(subKeyOpt) || !typeof subKeyOpt === 'object') {
      console.log('SYNTAXERROR parsing', keyOptName);
      console.log(subKeyOpt);
    }
    for (let characterPath in subKeyOpt) {
      if (characterPathBase !== '' && 'male_female'.includes(characterPath)) {
        console.log('SYNTAXERROR Unsupported use of "male" or "female" in ', keyOptName);
      } else if (!'next_taxon_male_female_sex_fig'.includes(characterPath)) {
        let fullCharacterPath = characterPathBase + MAKey.getCharacterTitle(characterPath);
        let character = MAKey.characterByPath[fullCharacterPath];
        if (!character) {
          character = {
            id: MAKey.characterById.length,
            path: fullCharacterPath
          }
          // Create a link to the global character description
          let parts = fullCharacterPath.split('|');
          while (parts && parts.length) {
            let path = parts.join('|');
            parts.shift();
            let desc = MAKey.characterDescriptions[path];
            if (desc) {
              character.desc = desc;
              break;
            }
          }
          MAKey.characterById.push(character);
          MAKey.characterByPath[fullCharacterPath] = character;
        }
        // Process and store the description of the taxon specific character
        let source = subKeyOpt[characterPath];
        if (!Array.isArray(source) && typeof source === 'object') {
          registerSubKeyOpt(charSet, source, fullCharacterPath + '|');
        } else {
          if (isCommon) {
            // Check sex
            let charDescSex = (character.desc) ? character.desc.sex : null;
            let sex;
            if (Array.isArray(source)) {
              if (source.includes('male')) {
                sex = 'male';
              }
              if (source.includes('female')) {
                sex = 'female';
              }
            }
            if (charDescSex && sex && (charDescSex !== sex)) {
              console.log('WARNING Sex specified in character description overwritten for', 
                fullCharacterPath, 'by', keyOptName);
            }
            sex = sex || charDescSex;
            if (sex) {
              subKeyOpt[sex] = subKeyOpt[sex] || {};
              subKeyOpt[sex][fullCharacterPath] = source;
              source = null;
              delete subKeyOpt[characterPath];
            }
          }
          if (source !== null) {
            if (Array.isArray(source) && source[0] === 'VARIANTS') {
              for (let i = 1; i < source.length; i++) {
                registerCharacter(charSet, source[i], character);
              }
            } else {
              registerCharacter(charSet, source, character);
            }
          }
        }
      }
    }
    if (subKeyOpt.male) {
      isCommon = false;
      subKeyOpt.male.sex = 'male';
      deltaCharSets.male = registerSubKeyOpt({}, subKeyOpt.male, ''); 
    }
    if (subKeyOpt.female) {
      isCommon = false;
      subKeyOpt.female.sex = 'female';
      deltaCharSets.female = registerSubKeyOpt({}, subKeyOpt.female, ''); 
    }
    return charSet;
  }

  ['characterDescriptions', 'figures'].forEach(descName => {
    let target = MAKey[descName] = MAKey[descName] || {};
    for (let objKey in keyDesc[descName]) {
      target[objKey] = target[objKey] || {};
      // TODO: Log a warning when overwriting data.
      Object.assign(target[objKey], keyDesc[descName][objKey]);
    }
  });
  if (keyDesc.singleAccessKey) {
    if (!MAKey.mainKey) {
      MAKey.mainKey = keyName;
    }
    for (keyEntityId in keyDesc.singleAccessKey) {
      let entity = keyDesc.singleAccessKey[keyEntityId];
      for (let keyOptId in entity) {
        keyOptName = keyName + ' ' + keyEntityId + '.' + keyOptId;
        // console.log(keyOptName, (entity[keyOptId].taxon || ''));
        isCommon = true;
        deltaCharSets = {};
        deltaCharSets.common = registerSubKeyOpt({}, entity[keyOptId], '');
        storeCharSets(entity[keyOptId]);
      }
    }
  }
  if (keyDesc.taxons) {
    for (let taxonName in keyDesc.taxons) {
      let targetTaxon = MAKey.taxons[taxonName] = MAKey.taxons[taxonName] || {};
      let taxonDesc = keyDesc.taxons[taxonName];
      deltaCharSets = {};
      for (let sex in taxonDesc) {
        if (sex === 'common') {
          isCommon = true;
        } else {
          taxonDesc[sex].sex = sex;
        }
        deltaCharSets[sex] = registerSubKeyOpt({}, taxonDesc[sex], '');
      }
      storeCharSets(null, taxonName, taxonDesc);
    }
  }
  MAKey.keys[keyName] = keyDesc;
};
 