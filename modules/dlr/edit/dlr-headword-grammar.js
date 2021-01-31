// Generated automatically by nearley, version undefined
// http://github.com/Hardmath123/nearley
function id(x) {
    return x[0];
}
let headwordGrammar = {
    Lexer: undefined,
    ParserRules: [{
            "name": "headword",
            "symbols": ["headwordLetters", "space", "gramGrp"],
            "postprocess": data => data.join("")
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["adj"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["adv"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["art"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["conj"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["interj"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["num"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["prep"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["pron"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["s"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["sPr"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["subst"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["verb"]
        },
        {
            "name": "gramGrp$subexpression$1",
            "symbols": ["loc"]
        },
        {
            "name": "gramGrp",
            "symbols": ["gramGrp$subexpression$1"],
            "postprocess": id => "<gramGrp xmlns=\"http://www.tei-c.org/ns/1.0\">" + id + "</gramGrp>"
        },
        {
            "name": "adj$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "d"
            }, {
                "literal": "j"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adj",
            "symbols": ["adj$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "adj",
            "symbols": ["adj", "space", "adjType"],
            "postprocess": data => data.join("")
        },
        {
            "name": "adj",
            "symbols": ["adj", "space", "adjType", "space", "adjNumber"],
            "postprocess": data => data.join("")
        },
        {
            "name": "adjType$subexpression$1$string$1",
            "symbols": [{
                "literal": "d"
            }, {
                "literal": "e"
            }, {
                "literal": "m"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adjType$subexpression$1",
            "symbols": ["adjType$subexpression$1$string$1"]
        },
        {
            "name": "adjType$subexpression$1$string$2",
            "symbols": [{
                "literal": "i"
            }, {
                "literal": "n"
            }, {
                "literal": "t"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "o"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "r"
            }, {
                "literal": "e"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adjType$subexpression$1",
            "symbols": ["adjType$subexpression$1$string$2"]
        },
        {
            "name": "adjType$subexpression$1$string$3",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "e"
            }, {
                "literal": "h"
            }, {
                "literal": "o"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adjType$subexpression$1",
            "symbols": ["adjType$subexpression$1$string$3"]
        },
        {
            "name": "adjType$subexpression$1$string$4",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "o"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adjType$subexpression$1",
            "symbols": ["adjType$subexpression$1$string$4"]
        },
        {
            "name": "adjType",
            "symbols": ["adjType$subexpression$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "adjNumber$string$1",
            "symbols": [{
                "literal": "i"
            }, {
                "literal": "n"
            }, {
                "literal": "v"
            }, {
                "literal": "a"
            }, {
                "literal": "r"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adjNumber",
            "symbols": ["adjNumber$string$1"],
            "postprocess": id => '<number value="' + id + '" />'
        },
        {
            "name": "adv$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "d"
            }, {
                "literal": "v"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "adv",
            "symbols": ["adv$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "adv",
            "symbols": ["adv", "space", "advType"],
            "postprocess": data => data.join("")
        },
        {
            "name": "advType$string$1",
            "symbols": [{
                "literal": "i"
            }, {
                "literal": "n"
            }, {
                "literal": "t"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "o"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "advType",
            "symbols": ["advType$string$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "art$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "r"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "art",
            "symbols": ["art$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "art",
            "symbols": ["art", "space", "artType"],
            "postprocess": data => data.join("")
        },
        {
            "name": "artType$subexpression$1$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "d"
            }, {
                "literal": "j"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "artType$subexpression$1",
            "symbols": ["artType$subexpression$1$string$1"]
        },
        {
            "name": "artType$subexpression$1$string$2",
            "symbols": [{
                "literal": "h"
            }, {
                "literal": "o"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "artType$subexpression$1",
            "symbols": ["artType$subexpression$1$string$2"]
        },
        {
            "name": "artType$subexpression$1$string$3",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "e"
            }, {
                "literal": "h"
            }, {
                "literal": "o"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "artType$subexpression$1",
            "symbols": ["artType$subexpression$1$string$3"]
        },
        {
            "name": "artType$subexpression$1$string$4",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "o"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "artType$subexpression$1",
            "symbols": ["artType$subexpression$1$string$4"]
        },
        {
            "name": "artType",
            "symbols": ["artType$subexpression$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "conj$string$1",
            "symbols": [{
                "literal": "c"
            }, {
                "literal": "o"
            }, {
                "literal": "n"
            }, {
                "literal": "j"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "conj",
            "symbols": ["conj$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "interj$string$1",
            "symbols": [{
                "literal": "i"
            }, {
                "literal": "n"
            }, {
                "literal": "t"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "j"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "interj",
            "symbols": ["interj$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "num$string$1",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "u"
            }, {
                "literal": "m"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "num",
            "symbols": ["num$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "num",
            "symbols": ["num", "space", "numType"],
            "postprocess": data => data.join("")
        },
        {
            "name": "numType$subexpression$1$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "d"
            }, {
                "literal": "v"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "numType$subexpression$1",
            "symbols": ["numType$subexpression$1$string$1"]
        },
        {
            "name": "numType$subexpression$1$string$2",
            "symbols": [{
                "literal": "c"
            }, {
                "literal": "a"
            }, {
                "literal": "r"
            }, {
                "literal": "d"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "numType$subexpression$1",
            "symbols": ["numType$subexpression$1$string$2"]
        },
        {
            "name": "numType$subexpression$1$string$3",
            "symbols": [{
                "literal": "c"
            }, {
                "literal": "o"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "numType$subexpression$1",
            "symbols": ["numType$subexpression$1$string$3"]
        },
        {
            "name": "numType$subexpression$1$string$4",
            "symbols": [{
                "literal": "m"
            }, {
                "literal": "u"
            }, {
                "literal": "l"
            }, {
                "literal": "t"
            }, {
                "literal": "i"
            }, {
                "literal": "p"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "numType$subexpression$1",
            "symbols": ["numType$subexpression$1$string$4"]
        },
        {
            "name": "numType$subexpression$1$string$5",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "e"
            }, {
                "literal": "h"
            }, {
                "literal": "o"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "numType$subexpression$1",
            "symbols": ["numType$subexpression$1$string$5"]
        },
        {
            "name": "numType$subexpression$1$string$6",
            "symbols": [{
                "literal": "o"
            }, {
                "literal": "r"
            }, {
                "literal": "d"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "numType$subexpression$1",
            "symbols": ["numType$subexpression$1$string$6"]
        },
        {
            "name": "numType",
            "symbols": ["numType$subexpression$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "prep$string$1",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "r"
            }, {
                "literal": "e"
            }, {
                "literal": "p"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "prep",
            "symbols": ["prep$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "pron$string$1",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "r"
            }, {
                "literal": "o"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pron",
            "symbols": ["pron$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "pron",
            "symbols": ["pron", "space", "pronType"],
            "postprocess": data => data.join("")
        },
        {
            "name": "pron",
            "symbols": ["pron", "space", "pronType", "space", "gender1"],
            "postprocess": data => data.join("")
        },
        {
            "name": "pron",
            "symbols": ["pron", "space", "pronType", "space", "gender1", "space", "pronPerson"],
            "postprocess": data => data.join("")
        },
        {
            "name": "pron",
            "symbols": ["pron", "space", "pronType", "space", "gender1", "space", "pronPerson", "space", "number1"],
            "postprocess": data => data.join("")
        },
        {
            "name": "pron",
            "symbols": ["pron", "space", "pronType", "space", "gender1", "space", "pronPerson", "space", "number1", "space", "pronPosition"],
            "postprocess": data => data.join("")
        },
        {
            "name": "pron",
            "symbols": ["pron", "space", "pronType", "space", "gender1", "space", "pronPerson", "space", "number1", "space", "pronPosition", "space", "articulation"],
            "postprocess": data => data.join("")
        },
        {
            "name": "pronType$subexpression$1$string$1",
            "symbols": [{
                "literal": "d"
            }, {
                "literal": "e"
            }, {
                "literal": "m"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$1"]
        },
        {
            "name": "pronType$subexpression$1$string$2",
            "symbols": [{
                "literal": "i"
            }, {
                "literal": "n"
            }, {
                "literal": "t"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "o"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "r"
            }, {
                "literal": "e"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$2"]
        },
        {
            "name": "pronType$subexpression$1$string$3",
            "symbols": [{
                "literal": "î"
            }, {
                "literal": "n"
            }, {
                "literal": "t"
            }, {
                "literal": "ă"
            }, {
                "literal": "r"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$3"]
        },
        {
            "name": "pronType$subexpression$1$string$4",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "e"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$4"]
        },
        {
            "name": "pronType$subexpression$1$string$5",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "e"
            }, {
                "literal": "h"
            }, {
                "literal": "o"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$5"]
        },
        {
            "name": "pronType$subexpression$1$string$6",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$6"]
        },
        {
            "name": "pronType$subexpression$1$string$7",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "o"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$7"]
        },
        {
            "name": "pronType$subexpression$1$string$8",
            "symbols": [{
                "literal": "r"
            }, {
                "literal": "e"
            }, {
                "literal": "f"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$8"]
        },
        {
            "name": "pronType$subexpression$1$string$9",
            "symbols": [{
                "literal": "d"
            }, {
                "literal": "e"
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "o"
            }, {
                "literal": "l"
            }, {
                "literal": "i"
            }, {
                "literal": "t"
            }, {
                "literal": "e"
            }, {
                "literal": "ţ"
            }, {
                "literal": "e"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronType$subexpression$1",
            "symbols": ["pronType$subexpression$1$string$9"]
        },
        {
            "name": "pronType",
            "symbols": ["pronType$subexpression$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "pronPerson$subexpression$1$string$1",
            "symbols": [{
                "literal": "l"
            }, {
                "literal": "a"
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "1"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronPerson$subexpression$1",
            "symbols": ["pronPerson$subexpression$1$string$1"]
        },
        {
            "name": "pronPerson$subexpression$1$string$2",
            "symbols": [{
                "literal": "l"
            }, {
                "literal": "a"
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "2"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronPerson$subexpression$1",
            "symbols": ["pronPerson$subexpression$1$string$2"]
        },
        {
            "name": "pronPerson$subexpression$1$string$3",
            "symbols": [{
                "literal": "l"
            }, {
                "literal": "a"
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "e"
            }, {
                "literal": "r"
            }, {
                "literal": "s"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "3"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronPerson$subexpression$1",
            "symbols": ["pronPerson$subexpression$1$string$3"]
        },
        {
            "name": "pronPerson",
            "symbols": ["pronPerson$subexpression$1"],
            "postprocess": id => '<per value="' + id + '" />'
        },
        {
            "name": "pronPosition$subexpression$1$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "n"
            }, {
                "literal": "t"
            }, {
                "literal": "e"
            }, {
                "literal": "p"
            }, {
                "literal": "u"
            }, {
                "literal": "s"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronPosition$subexpression$1",
            "symbols": ["pronPosition$subexpression$1$string$1"]
        },
        {
            "name": "pronPosition$subexpression$1$string$2",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "o"
            }, {
                "literal": "s"
            }, {
                "literal": "t"
            }, {
                "literal": "p"
            }, {
                "literal": "u"
            }, {
                "literal": "s"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "pronPosition$subexpression$1",
            "symbols": ["pronPosition$subexpression$1$string$2"]
        },
        {
            "name": "pronPosition",
            "symbols": ["pronPosition$subexpression$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "s$string$1",
            "symbols": [{
                "literal": "s"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "s",
            "symbols": ["s$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "s",
            "symbols": ["s", "comma", "gender2"],
            "postprocess": data => data.join("")
        },
        {
            "name": "s",
            "symbols": ["s", "comma", "gender2", "comma", "number2"],
            "postprocess": data => data.join("")
        },
        {
            "name": "s",
            "symbols": ["s", "comma", "gender2", "comma", "number2", "comma", "sCase"],
            "postprocess": data => data.join("")
        },
        {
            "name": "s",
            "symbols": ["s", "comma", "gender2", "comma", "number2", "comma", "sCase", "comma", "articulation"],
            "postprocess": data => data.join("")
        },
        {
            "name": "sCase$subexpression$1$string$1",
            "symbols": [{
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$1"]
        },
        {
            "name": "sCase$subexpression$1$string$2",
            "symbols": [{
                "literal": "g"
            }, {
                "literal": "e"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$2"]
        },
        {
            "name": "sCase$subexpression$1$string$3",
            "symbols": [{
                "literal": "g"
            }, {
                "literal": "e"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "ș"
            }, {
                "literal": "i"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$3"]
        },
        {
            "name": "sCase$subexpression$1$string$4",
            "symbols": [{
                "literal": "g"
            }, {
                "literal": "e"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "s"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$4"]
        },
        {
            "name": "sCase$subexpression$1$string$5",
            "symbols": [{
                "literal": "g"
            }, {
                "literal": "e"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "s"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "ș"
            }, {
                "literal": "i"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$5"]
        },
        {
            "name": "sCase$subexpression$1$string$6",
            "symbols": [{
                "literal": "g"
            }, {
                "literal": "e"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$6"]
        },
        {
            "name": "sCase$subexpression$1$string$7",
            "symbols": [{
                "literal": "g"
            }, {
                "literal": "e"
            }, {
                "literal": "n"
            }, {
                "literal": "."
            }, {
                "literal": "-"
            }, {
                "literal": "d"
            }, {
                "literal": "a"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "ș"
            }, {
                "literal": "i"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$7"]
        },
        {
            "name": "sCase$subexpression$1$string$8",
            "symbols": [{
                "literal": "v"
            }, {
                "literal": "o"
            }, {
                "literal": "c"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sCase$subexpression$1",
            "symbols": ["sCase$subexpression$1$string$8"]
        },
        {
            "name": "sCase",
            "symbols": ["sCase$subexpression$1"],
            "postprocess": id => '<case value="' + id + '" />'
        },
        {
            "name": "sPr$string$1",
            "symbols": [{
                "literal": "s"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "p"
            }, {
                "literal": "r"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "sPr",
            "symbols": ["sPr$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "sPr",
            "symbols": ["sPr", "space", "articulation"],
            "postprocess": data => data.join("")
        },
        {
            "name": "subst$string$1",
            "symbols": [{
                "literal": "s"
            }, {
                "literal": "u"
            }, {
                "literal": "b"
            }, {
                "literal": "s"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "subst",
            "symbols": ["subst$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "subst",
            "symbols": ["subst", "space", "number1"],
            "postprocess": data => data.join("")
        },
        {
            "name": "verb$string$1",
            "symbols": [{
                "literal": "v"
            }, {
                "literal": "b"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "verb",
            "symbols": ["verb$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "verb",
            "symbols": ["verb", "space", "verbConjugation"],
            "postprocess": data => data.join("")
        },
        {
            "name": "verbConjugation$subexpression$1",
            "symbols": [{
                "literal": "I",
                "pos": 640
            }]
        },
        {
            "name": "verbConjugation$subexpression$1$string$1",
            "symbols": [{
                "literal": "I"
            }, {
                "literal": "I"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "verbConjugation$subexpression$1",
            "symbols": ["verbConjugation$subexpression$1$string$1"]
        },
        {
            "name": "verbConjugation$subexpression$1$string$2",
            "symbols": [{
                "literal": "I"
            }, {
                "literal": "I"
            }, {
                "literal": "I"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "verbConjugation$subexpression$1",
            "symbols": ["verbConjugation$subexpression$1$string$2"]
        },
        {
            "name": "verbConjugation$subexpression$1$string$3",
            "symbols": [{
                "literal": "I"
            }, {
                "literal": "V"
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "verbConjugation$subexpression$1",
            "symbols": ["verbConjugation$subexpression$1$string$3"]
        },
        {
            "name": "verbConjugation",
            "symbols": ["verbConjugation$subexpression$1"],
            "postprocess": id => '<iType value="' + id + '" />'
        },
        {
            "name": "loc$string$1",
            "symbols": [{
                "literal": "l"
            }, {
                "literal": "o"
            }, {
                "literal": "c"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "loc",
            "symbols": ["loc$string$1"],
            "postprocess": id => '<pos value="' + id + '" />'
        },
        {
            "name": "loc",
            "symbols": ["loc", "space", "locType"],
            "postprocess": data => data.join("")
        },
        {
            "name": "locType$subexpression$1$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "d"
            }, {
                "literal": "j"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "locType$subexpression$1",
            "symbols": ["locType$subexpression$1$string$1"]
        },
        {
            "name": "locType$subexpression$1$string$2",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "d"
            }, {
                "literal": "v"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "locType$subexpression$1",
            "symbols": ["locType$subexpression$1$string$2"]
        },
        {
            "name": "locType$subexpression$1$string$3",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "r"
            }, {
                "literal": "e"
            }, {
                "literal": "p"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "locType$subexpression$1",
            "symbols": ["locType$subexpression$1$string$3"]
        },
        {
            "name": "locType$subexpression$1$string$4",
            "symbols": [{
                "literal": "c"
            }, {
                "literal": "o"
            }, {
                "literal": "n"
            }, {
                "literal": "j"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "locType$subexpression$1",
            "symbols": ["locType$subexpression$1$string$4"]
        },
        {
            "name": "locType$subexpression$1$string$5",
            "symbols": [{
                "literal": "v"
            }, {
                "literal": "b"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "locType$subexpression$1",
            "symbols": ["locType$subexpression$1$string$5"]
        },
        {
            "name": "locType",
            "symbols": ["locType$subexpression$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "headwordLetters$ebnf$1",
            "symbols": [/[A-ZÁÉÍÓÚẮẤŞŢĂÂÎȘȚ]/]
        },
        {
            "name": "headwordLetters$ebnf$1",
            "symbols": [/[A-ZÁÉÍÓÚẮẤŞŢĂÂÎȘȚ]/, "headwordLetters$ebnf$1"],
            "postprocess": function arrconcat(d) {
                return [d[0]].concat(d[1]);
            }
        },
        {
            "name": "headwordLetters",
            "symbols": ["headwordLetters$ebnf$1", "digits"],
            "postprocess": data => '<form xmlns=\"http://www.tei-c.org/ns/1.0\" type="lemma"><orth n="' + data[1] + '">' + data[0].join("") + '</orth></form>'
        },
        {
            "name": "gender1$subexpression$1$string$1",
            "symbols": [{
                "literal": "f"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender1$subexpression$1",
            "symbols": ["gender1$subexpression$1$string$1"]
        },
        {
            "name": "gender1$subexpression$1$string$2",
            "symbols": [{
                "literal": "m"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender1$subexpression$1",
            "symbols": ["gender1$subexpression$1$string$2"]
        },
        {
            "name": "gender1$subexpression$1$string$3",
            "symbols": [{
                "literal": "m"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "ș"
            }, {
                "literal": "i"
            }, {
                "literal": " "
            }, {
                "literal": "f"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender1$subexpression$1",
            "symbols": ["gender1$subexpression$1$string$3"]
        },
        {
            "name": "gender1",
            "symbols": ["gender1$subexpression$1"],
            "postprocess": id => '<gen value="' + id + '" />'
        },
        {
            "name": "gender2$subexpression$1$string$1",
            "symbols": [{
                "literal": "f"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender2$subexpression$1",
            "symbols": ["gender2$subexpression$1$string$1"]
        },
        {
            "name": "gender2$subexpression$1$string$2",
            "symbols": [{
                "literal": "m"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender2$subexpression$1",
            "symbols": ["gender2$subexpression$1$string$2"]
        },
        {
            "name": "gender2$subexpression$1$string$3",
            "symbols": [{
                "literal": "m"
            }, {
                "literal": "."
            }, {
                "literal": " "
            }, {
                "literal": "ș"
            }, {
                "literal": "i"
            }, {
                "literal": " "
            }, {
                "literal": "f"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender2$subexpression$1",
            "symbols": ["gender2$subexpression$1$string$3"]
        },
        {
            "name": "gender2$subexpression$1$string$4",
            "symbols": [{
                "literal": "n"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "gender2$subexpression$1",
            "symbols": ["gender2$subexpression$1$string$4"]
        },
        {
            "name": "gender2",
            "symbols": ["gender2$subexpression$1"],
            "postprocess": id => '<gen value="' + id + '" />'
        },
        {
            "name": "number1$subexpression$1$string$1",
            "symbols": [{
                "literal": "s"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "number1$subexpression$1",
            "symbols": ["number1$subexpression$1$string$1"]
        },
        {
            "name": "number1$subexpression$1$string$2",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "number1$subexpression$1",
            "symbols": ["number1$subexpression$1$string$2"]
        },
        {
            "name": "number1",
            "symbols": ["number1$subexpression$1"],
            "postprocess": id => '<number value="' + id + '" />'
        },
        {
            "name": "number2$subexpression$1$string$1",
            "symbols": [{
                "literal": "s"
            }, {
                "literal": "g"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "number2$subexpression$1",
            "symbols": ["number2$subexpression$1$string$1"]
        },
        {
            "name": "number2$subexpression$1$string$2",
            "symbols": [{
                "literal": "p"
            }, {
                "literal": "l"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "number2$subexpression$1",
            "symbols": ["number2$subexpression$1$string$2"]
        },
        {
            "name": "number2$subexpression$1$string$3",
            "symbols": [{
                "literal": "i"
            }, {
                "literal": "n"
            }, {
                "literal": "v"
            }, {
                "literal": "a"
            }, {
                "literal": "r"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "number2$subexpression$1",
            "symbols": ["number2$subexpression$1$string$3"]
        },
        {
            "name": "number2",
            "symbols": ["number2$subexpression$1"],
            "postprocess": id => '<number value="' + id + '" />'
        },
        {
            "name": "articulation$string$1",
            "symbols": [{
                "literal": "a"
            }, {
                "literal": "r"
            }, {
                "literal": "t"
            }, {
                "literal": "."
            }],
            "postprocess": function joiner(d) {
                return d.join('');
            }
        },
        {
            "name": "articulation",
            "symbols": ["articulation$string$1"],
            "postprocess": id => '<subc value="' + id + '" />'
        },
        {
            "name": "digits$ebnf$1",
            "symbols": [/[0-9]/],
            "postprocess": id
        },
        {
            "name": "digits$ebnf$1",
            "symbols": [],
            "postprocess": function(d) {
                return null;
            }
        },
        {
            "name": "digits",
            "symbols": ["digits$ebnf$1"]
        },
        {
            "name": "comma",
            "symbols": [{
                "literal": ",",
                "pos": 804
            }, "space"],
            "postprocess": data => data.join("")
        },
        {
            "name": "space",
            "symbols": [{
                "literal": " ",
                "pos": 814
            }]
        }
    ],
    ParserStart: "headword"
}

export default headwordGrammar;