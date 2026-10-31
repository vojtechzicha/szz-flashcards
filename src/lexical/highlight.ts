import hljs from 'highlight.js/lib/core'
import type { HLJSApi, Language } from 'highlight.js'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import ini from 'highlight.js/lib/languages/ini'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import pgsql from 'highlight.js/lib/languages/pgsql'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import powershell from 'highlight.js/lib/languages/powershell'
import python from 'highlight.js/lib/languages/python'
import r from 'highlight.js/lib/languages/r'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

// Syntax highlighting for fenced code blocks on cards (src/lexical/render.tsx).
// Only the languages below are bundled; an unknown or missing language tag
// renders as plain monospace text. Tokens are coloured by `.hljs-*` rules in
// src/styles/card-presentation.css.

/** NetLogo (agent-based modelling, KOS). highlight.js ships no grammar for it. */
function netlogo(hl: HLJSApi): Language {
  return {
    name: 'NetLogo',
    case_insensitive: true,
    keywords: {
      $pattern: /[A-Za-z_?][A-Za-z0-9_?!<>=.*/+-]*/,
      keyword: [
        'to', 'to-report', 'end', 'report', 'stop', 'globals', 'breed', 'directed-link-breed',
        'undirected-link-breed', 'turtles-own', 'patches-own', 'links-own', 'extensions',
        'let', 'set', 'ask', 'ask-concurrent', 'with', 'of', 'if', 'ifelse', 'ifelse-value',
        'while', 'repeat', 'loop', 'foreach', 'map', 'filter', 'reduce', 'run', 'runresult',
        'carefully', 'error', 'and', 'or', 'not', 'xor', 'hatch', 'sprout', 'die', 'create-turtles',
        'crt', 'create-ordered-turtles', 'cro', 'clear-all', 'ca', 'clear-turtles', 'ct',
        'clear-patches', 'cp', 'reset-ticks', 'tick', 'tick-advance', 'setup-plots', 'update-plots',
        'with-max', 'with-min', 'max-one-of', 'min-one-of', 'one-of', 'n-of', 'up-to-n-of',
        'other', 'in-radius', 'in-cone', 'at-points', 'neighbors', 'neighbors4',
      ],
      built_in: [
        'fd', 'forward', 'bk', 'back', 'rt', 'right', 'lt', 'left', 'setxy', 'move-to', 'face',
        'facexy', 'jump', 'home', 'pen-down', 'pd', 'pen-up', 'pu', 'stamp', 'show', 'print',
        'type', 'write', 'user-message', 'random', 'random-float', 'random-normal', 'random-poisson',
        'random-exponential', 'random-seed', 'count', 'sum', 'mean', 'median', 'max', 'min',
        'abs', 'sqrt', 'exp', 'ln', 'log', 'round', 'floor', 'ceiling', 'precision', 'mod',
        'remainder', 'sin', 'cos', 'tan', 'atan', 'distance', 'distancexy', 'towards', 'towardsxy',
        'patch-ahead', 'patch-here', 'patch-at', 'patch', 'turtles-here', 'turtles-at', 'turtles-on',
        'any?', 'all?', 'member?', 'empty?', 'is-number?', 'list', 'fput', 'lput', 'first', 'last',
        'butfirst', 'bf', 'butlast', 'bl', 'item', 'length', 'sentence', 'se', 'sort', 'sort-by',
        'remove', 'remove-duplicates', 'replace-item', 'position', 'word', 'range',
        'create-link-with', 'create-link-to', 'create-link-from', 'link-neighbors', 'my-links',
        'scale-color', 'rgb', 'plot', 'plotxy', 'set-current-plot', 'diffuse', 'export-world',
      ],
      variable: [
        'turtles', 'patches', 'links', 'turtle', 'link', 'myself', 'self', 'nobody', 'ticks',
        'who', 'color', 'heading', 'xcor', 'ycor', 'shape', 'size', 'label', 'label-color',
        'hidden?', 'pen-mode', 'pen-size', 'pcolor', 'plabel', 'plabel-color', 'pxcor',
        'pycor', 'world-width', 'world-height', 'max-pxcor', 'max-pycor', 'min-pxcor', 'min-pycor',
      ],
      literal: [
        'true', 'false', 'black', 'gray', 'grey', 'white', 'red', 'orange', 'brown', 'yellow',
        'green', 'lime', 'turquoise', 'cyan', 'sky', 'blue', 'violet', 'magenta', 'pink',
      ],
    },
    contains: [
      hl.COMMENT(';', '$'),
      hl.QUOTE_STRING_MODE,
      { scope: 'number', match: /-?\b\d+(\.\d+)?([eE]-?\d+)?\b/ },
      {
        // procedure name after `to` / `to-report`
        match: [/\bto(?:-report)?\s+/, /[A-Za-z_][A-Za-z0-9_?!.-]*/],
        scope: { 1: 'keyword', 2: 'title.function' },
      },
      { scope: 'punctuation', match: /[[\]()]/ },
    ],
  }
}

const LANGUAGES: Record<string, (hl: HLJSApi) => Language> = {
  netlogo,
  bash,
  shell,
  powershell,
  c,
  cpp,
  csharp,
  java,
  javascript,
  typescript,
  python,
  r,
  php,
  sql,
  pgsql,
  json,
  yaml,
  xml,
  css,
  markdown,
  dockerfile,
  ini,
  plaintext,
}

for (const [name, grammar] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, grammar)
hljs.registerAliases(['nlogo', 'nls'], { languageName: 'netlogo' })
hljs.registerAliases(['mongo', 'mongodb', 'mongosh'], { languageName: 'javascript' })
hljs.registerAliases(['text', 'txt', 'none'], { languageName: 'plaintext' })

/** Language tags the renderer can highlight (names; aliases like js, py, sh also work). */
export const HIGHLIGHT_LANGUAGES = Object.keys(LANGUAGES)

/**
 * Highlighted HTML for `code`, or null when the language is unknown (the
 * caller then renders the code as plain text). highlight.js escapes the code.
 */
export function highlightCode(code: string, language: string | null | undefined): string | null {
  const lang = language?.trim().toLowerCase()
  if (!lang || !hljs.getLanguage(lang)) return null
  try {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
  } catch {
    return null
  }
}
