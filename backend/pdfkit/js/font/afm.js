// Generated by CoffeeScript 1.10.0
(function() {
  var AFMFont, fs;

  fs = require('fs');

  AFMFont = (function() {
    var WIN_ANSI_MAP, characters;

    AFMFont.open = function(filename) {
      return new AFMFont(fs.readFileSync(filename, 'utf8'));
    };

    function AFMFont(contents) {
      var e, i;
      this.contents = contents;
      this.attributes = {};
      this.glyphWidths = {};
      this.boundingBoxes = {};
      this.kernPairs = {};
      this.parse();
      this.charWidths = (function() {
        var j, results;
        results = [];
        for (i = j = 0; j <= 255; i = ++j) {
          results.push(this.glyphWidths[characters[i]]);
        }
        return results;
      }).call(this);
      this.bbox = (function() {
        var j, len, ref, results;
        ref = this.attributes['FontBBox'].split(/\s+/);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          e = ref[j];
          results.push(+e);
        }
        return results;
      }).call(this);
      this.ascender = +(this.attributes['Ascender'] || 0);
      this.descender = +(this.attributes['Descender'] || 0);
      this.lineGap = (this.bbox[3] - this.bbox[1]) - (this.ascender - this.descender);
    }

    AFMFont.prototype.parse = function() {
      var a, j, key, len, line, match, name, ref, section, value;
      section = '';
      ref = this.contents.split('\n');
      for (j = 0, len = ref.length; j < len; j++) {
        line = ref[j];
        if (match = line.match(/^Start(\w+)/)) {
          section = match[1];
          continue;
        } else if (match = line.match(/^End(\w+)/)) {
          section = '';
          continue;
        }
        switch (section) {
          case 'FontMetrics':
            match = line.match(/(^\w+)\s+(.*)/);
            key = match[1];
            value = match[2];
            if (a = this.attributes[key]) {
              if (!Array.isArray(a)) {
                a = this.attributes[key] = [a];
              }
              a.push(value);
            } else {
              this.attributes[key] = value;
            }
            break;
          case 'CharMetrics':
            if (!/^CH?\s/.test(line)) {
              continue;
            }
            name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
            this.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
            break;
          case 'KernPairs':
            match = line.match(/^KPX\s+(\.?\w+)\s+(\.?\w+)\s+(-?\d+)/);
            if (match) {
              this.kernPairs[match[1] + '\0' + match[2]] = parseInt(match[3]);
            }
        }
      }
    };

    WIN_ANSI_MAP = {
      402: 131,
      8211: 150,
      8212: 151,
      8216: 145,
      8217: 146,
      8218: 130,
      8220: 147,
      8221: 148,
      8222: 132,
      8224: 134,
      8225: 135,
      8226: 149,
      8230: 133,
      8364: 128,
      8240: 137,
      8249: 139,
      8250: 155,
      710: 136,
      8482: 153,
      338: 140,
      339: 156,
      732: 152,
      352: 138,
      353: 154,
      376: 159,
      381: 142,
      382: 158
    };

    AFMFont.prototype.encodeText = function(text) {
      var char, i, j, ref, res;
      res = [];
      for (i = j = 0, ref = text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        char = text.charCodeAt(i);
        char = WIN_ANSI_MAP[char] || char;
        res.push(char.toString(16));
      }
      return res;
    };

    AFMFont.prototype.glyphsForString = function(string) {
      var charCode, glyphs, i, j, ref;
      glyphs = [];
      for (i = j = 0, ref = string.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        charCode = string.charCodeAt(i);
        glyphs.push(this.characterToGlyph(charCode));
      }
      return glyphs;
    };

    AFMFont.prototype.characterToGlyph = function(character) {
      return characters[WIN_ANSI_MAP[character] || character] || '.notdef';
    };

    AFMFont.prototype.widthOfGlyph = function(glyph) {
      return this.glyphWidths[glyph] || 0;
    };

    AFMFont.prototype.getKernPair = function(left, right) {
      return this.kernPairs[left + '\0' + right] || 0;
    };

    AFMFont.prototype.advancesForGlyphs = function(glyphs) {
      var advances, index, j, left, len, right;
      advances = [];
      for (index = j = 0, len = glyphs.length; j < len; index = ++j) {
        left = glyphs[index];
        right = glyphs[index + 1];
        advances.push(this.widthOfGlyph(left) + this.getKernPair(left, right));
      }
      return advances;
    };

    characters = '.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis'.split(/\s+/);

    return AFMFont;

  })();

  module.exports = AFMFont;

}).call(this);
