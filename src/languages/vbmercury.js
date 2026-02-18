/*
Language: Mercury (VB)
Author: Carlo Kok <ck@remobjects.com>
Contributor: Poren Chiang <ren.chiang@gmail.com>, Jan Pilzer
Description: Mercury is RemObjects Software's Visual Basic-compatible language for the Elements compiler, with additional platform-specific extensions.
Website: https://www.elementscompiler.com/elements/mercury/
*/

/** @type LanguageFn */
export default function(hljs) {
  const regex = hljs.regex;
  /**
   * Character Literal
   * Either a single character ("a"C) or an escaped double quote (""""C).
   */
  const CHARACTER = {
    className: 'string',
    begin: /"(""|[^/n])"C\b/
  };

  const STRING = {
    className: 'string',
    begin: /"/,
    end: /"/,
    illegal: /\n/,
    contains: [
      {
        // double quote escape
        begin: /""/
      }
    ]
  };

  /** Date Literals consist of a date, a time, or both separated by whitespace, surrounded by # */
  const MM_DD_YYYY = /\d{1,2}\/\d{1,2}\/\d{4}/;
  const YYYY_MM_DD = /\d{4}-\d{1,2}-\d{1,2}/;
  const TIME_12H = /(\d|1[012])(:\d+){0,2} *(AM|PM)/;
  const TIME_24H = /\d{1,2}(:\d{1,2}){1,2}/;
  const DATE = {
    className: 'literal',
    variants: [
      {
        // #YYYY-MM-DD# (ISO-Date) or #M/D/YYYY# (US-Date)
        begin: regex.concat(/# */, regex.either(YYYY_MM_DD, MM_DD_YYYY), / *#/)
      },
      {
        // #H:mm[:ss]# (24h Time)
        begin: regex.concat(/# */, TIME_24H, / *#/)
      },
      {
        // #h[:mm[:ss]] A# (12h Time)
        begin: regex.concat(/# */, TIME_12H, / *#/)
      },
      {
        // date plus time
        begin: regex.concat(
          /# */,
          regex.either(YYYY_MM_DD, MM_DD_YYYY),
          / +/,
          regex.either(TIME_12H, TIME_24H),
          / *#/
        )
      }
    ]
  };

  const NUMBER = {
    className: 'number',
    relevance: 0,
    variants: [
      {
        // Float
        begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/
      },
      {
        // Integer (base 10)
        begin: /\b\d[\d_]*((U?[SIL])|[%&])?/
      },
      {
        // Integer (base 16)
        begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/
      },
      {
        // Integer (base 8)
        begin: /&O[0-7_]+((U?[SIL])|[%&])?/
      },
      {
        // Integer (base 2)
        begin: /&B[01_]+((U?[SIL])|[%&])?/
      }
    ]
  };

  const LABEL = {
    className: 'label',
    begin: /^\w+:/
  };

  const DOC_COMMENT = hljs.COMMENT(/'''/, /$/, {
    contains: [
      {
        className: 'doctag',
        begin: /<\/?/,
        end: />/
      }
    ]
  });

  const COMMENT = hljs.COMMENT(null, /$/, {
    variants: [
      {
        begin: /'/
      },
      {
        // TODO: Use multi-class for leading spaces
        begin: /([\t ]|^)REM(?=\s)/
      }
    ]
  });

  const DIRECTIVES = {
    className: 'meta',
    // TODO: Use multi-class for indentation once available
    begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
    end: /$/,
    keywords: {
      keyword:
        'const disable else elseif enable end externalsource if region then'
    },
    contains: [ COMMENT ]
  };

  return {
    name: 'Mercury',
    aliases: [ 'vbmercury' ],
    case_insensitive: true,
    classNameAliases: {
      label: 'symbol'
    },
    keywords: {
      keyword:
        'ensure check invariants old require addhandler addressof alias and andalso ansi as ascending assembly async auto autoreleasepool await boolean by byref byte byval call case catch cbool cbyte cchar cdate cdbl cdec char cint class clng cobj const continue csbyte cshort csng cstr ctrytype ctype cuint culng cushort custom decimal declare default delegate descending dim directcast distinct do double dynamic each else elseif end endif enum equals erase error event exit extends false finally for friend from function get gettype getxmlnamespace global gosub goto group handles if implements imports in index inherits integer interface into is isfalse isnot istrue iterator join key lazy let lib like long loop mappedto matching me mid mod module mustinherit mustoverride mybase myclass mymapped namespace narrowing new next not nothing notinheritable notoverridable null object of off on operator option optional or order orelse out overloads overridable overrides paramarray partial preserve private property protected ptr public raiseevent readonly record redim rem removehandler resume return sbyte select set shadows shared short single skip static step stop string structure strict sub synclock take text then throw to true try trycast typeof uinteger ulong unicode unmanaged unsafe until ushort using variant wend when where while widening with withevents writeonly xor yield zip'
    },
    illegal:
      '//|\\{|\\}|endif|gosub|variant|wend|^\\$ ' /* reserved deprecated keywords */,
    contains: [
      CHARACTER,
      STRING,
      DATE,
      NUMBER,
      LABEL,
      DOC_COMMENT,
      COMMENT,
      DIRECTIVES
    ]
  };
}
