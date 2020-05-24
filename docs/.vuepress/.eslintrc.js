'use strict'

module.exports = {
  extends: [
    'plugin:vue/recommended'
  ],
  rules: {
    'vue/component-tags-order': ['error', {
      'order': ['template', 'script', 'style']
    }]
  }
}
