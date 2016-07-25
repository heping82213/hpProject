// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
var antlr4 = require("antlr4");
var GraphqlLexer = require("../../../../src/component/GQLEditor/ast/GraphqlLexer");
var GraphqlParser = require("../../../../src/component/GQLEditor/ast/GraphqlParser");
var LintErrorListener = require("../../../../src/component/GQLEditor/ast/LintErrorListener");

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  // declare global: JSHINT

  var bogus = [ "Dangerous comment" ];

  var warnings = [ [ "Expected '{'",
                     "Statement body should be inside '{ }' braces." ] ];

  var errors = [ "Missing semicolon", "Extra comma", "Missing property name",
                 "Unmatched ", " and instead saw", " is not defined",
                 "Unclosed string", "Stopping, unable to continue" ];

  function validator(text, options) {

    var chars = new antlr4.InputStream(text);
    var lexer = new GraphqlLexer.GraphqlLexer(chars);
    var tokens = new antlr4.CommonTokenStream(lexer);
    var parser = new GraphqlParser.GraphqlParser(tokens);
    var lintErrorListener = new LintErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(lintErrorListener);
    lexer.removeErrorListeners();
    lexer.addErrorListener(lintErrorListener);
    parser.buildParseTrees = true;
    var document = parser.document();
    var errors = lintErrorListener.getErrors();
    var result = parseErrors(errors, result);
    return result;
  }

  CodeMirror.registerHelper("lint", "javascript", validator);

  function parseErrors(errors) {
    var output = [];
    errors.forEach(function(error){
      output.push({
        message: error.message,
        severity: error.severity,
        from: CodeMirror.Pos(error.line - 1, error.col),
        to: CodeMirror.Pos(error.line - 1, error.colEnd)
      });
    });
    return output;
  }
});
