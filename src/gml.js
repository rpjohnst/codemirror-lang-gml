import { parser } from "lezer-gml";
import { LezerLanguage, LanguageSupport, indentNodeProp, continuedIndent, foldNodeProp } from "@codemirror/language";
import { styleTags, tags } from "@codemirror/highlight";

export const gmlLanguage = LezerLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Statement: continuedIndent({ except: /^\s*{/ }),
        BlockStatement: context => {
          const closed = /^\s*(?:}|end\b|case\b|default\b)/.test(context.textAfter);
          return context.baseIndent + (closed ? 0 : context.unit);
        },
        IfStatement: continuedIndent({ except: /^\s*(?:{|else\b)/ }),
        DoStatement: continuedIndent({ except: /^\s*(?:{|until\b)/ }),
      }),
      foldNodeProp.add({
        BlockStatement(tree) { return { from: tree.firstChild.to, to: tree.lastChild.from }; },
        BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; },
      }),
      styleTags({
        LineComment: tags.lineComment,
        BlockComment: tags.blockComment,
        Identifier: tags.variableName,
        String: tags.string,
        Real: tags.float,
        "true false": tags.bool,
        "self other all noone global local": tags.atom,
        "not div mod and or xor": tags.operatorKeyword,
        "begin end if then else repeat while do until for with switch break continue exit return case default": tags.controlKeyword,
        "var globalvar": tags.definitionKeyword,
        ".": tags.derefOperator,
        '+ - "*" "/"': tags.arithmeticOperator,
        '"!" && || ^^': tags.logicOperator,
        "~ << >> & | ^": tags.bitwiseOperator,
        '< <= == "!=" <> >= >': tags.compareOperator,
        '= := += -= "*=" "/=" &= |= ^=': tags.updateOperator,
        ", ;": tags.separator,
        "[ ]": tags.squareBracket,
        "( )": tags.paren,
        "{ }": tags.brace,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:{|}|begin|end|until|case |default:)$/,
  }
});

export function gml() {
  return new LanguageSupport(gmlLanguage);
}