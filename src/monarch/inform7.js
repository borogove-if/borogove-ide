export default {
  ignoreCase: true,
  brackets: [],

  tokenizer: {
    root: [
      // Headers
      [/^\s*(volume|book|part|chapter|section)\s.*$/, 'type'],

      // Strings
      [/"/, 'string', '@string'],

      // Comments
      [/\[/, 'comment.doc', '@comment'],
      
      // I6 inclusions
      [/^\(\-/, { token: 'delimiter', bracket: '@open', next: '@inform6', nextEmbedded: 'inform6' }],
      [/^-\)/, { token: 'delimiter', bracket: '@close' } ],

      // Extension documentation
      [/^\s*----\s+DOCUMENTATION\s+----/, 'comment.doc', '@extension_doc']
    ],

    comment: [
      [/[^\]\[]+/, 'comment'],
			[/\]/, 'comment', '@pop'],
			[/\[/, 'comment', '@push']
    ],

    string: [
      [/\[.*?\]/, 'tag'],
      [/[^"]/, 'string'],
      [/"/, 'string', '@pop']
    ],

    inform6: [
      [/^-\)/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]
    ],

    extension_doc: [
      [/.*/, 'comment.doc']
    ]
  },
};
