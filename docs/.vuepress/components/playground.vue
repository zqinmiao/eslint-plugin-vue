<template>
  <div class="playground">
    <label>FileName:</label> <input v-model.trim="filename">
    <VueEslintEditor
      ref="editor"
      v-model="code"
      class="playground__editor"
      fix
      :linter="linter"
      :config="objectConfig"
      :preprocess="preprocess"
      :postprocess="postprocess"
      dark
      :format="format"
      :language="language"
      :filename="filename"
      :style="{ height: editorHeight }"
      @change="onChange"
    />
    <div class="playground__tools">
      <json-editor
        ref="jsonEditor"
        v-model="config"
        class="playground__json-editor"
        dark
        :format="format"
        :style="{ height: jsonEditorHeight }"
      />
      <ul class="playground__messages">
        <li v-if="configError">
          Config Error: {{ configError }}
        </li>
        <template v-for="(message, i) in messages">
          <li :key="i">
            [{{ message.line }}:{{ message.column }}]
            {{ message.message }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import path from 'path'
import VueEslintEditor from 'vue-eslint-editor'
import { rules, processors } from '../../../'
import JsonEditor from './playground/components/JsonEditor.vue'
import yaml from 'js-yaml'
import stripComments from 'strip-json-comments'
import { deserializeState, serializeState } from './playground/state'
import { resolveConfig } from './playground/eslint/config'
import CODE_DEFAULT from './playground/code-default.vue.txt'
const CONFIG_DEFAULT = `{
  "extends": [
    "plugin:vue/vue3-recommended"
  ]
}`
const FILENAME_DEFAULT = 'App.vue'

export default {
  name: 'Playground',
  components: { VueEslintEditor, JsonEditor },
  data () {
    const serializedString =
            (typeof window !== 'undefined' && window.location.hash.slice(1)) ||
            ''
    const state = deserializeState(serializedString)
    return {
      linter: null,
      code: state.code || CODE_DEFAULT,
      config: state.config || CONFIG_DEFAULT,
      preprocess: processors['.vue'].preprocess,
      postprocess: processors['.vue'].postprocess,
      filename: state.filename || FILENAME_DEFAULT,
      messages: []
    }
  },
  computed: {
    objectConfig () {
      try {
        return parseAndResolveConfig(this.config)
      } catch {
        /* nop */
      }
      return {}
    },
    configError () {
      try {
        parseAndResolveConfig(this.config)
        return ''
      } catch (e) {
        console.warn(e)
        return e.message
      }
    },
    language () {
      const ext = path.extname(this.filename)
      if (!ext) {
        return 'css'
      }
      switch (ext.toLowerCase()) {
        case '.js':
        case '.ts':
          return 'javascript'
        case '.html':
        case '.vue':
          return 'html'
        default:
          break
      }
      return 'html'
    },
    serializedString () {
      const code = CODE_DEFAULT === this.code ? undefined : this.code
      const config =
                CONFIG_DEFAULT === this.config ? undefined : this.config
      const filename =
                FILENAME_DEFAULT === this.filename ? undefined : this.filename
      const serializedString = serializeState({
        code,
        config,
        filename
      })
      return serializedString
    },
    format () {
      return {
        insertSpaces: true,
        tabSize: 2
      }
    },
    editorHeight () {
      const lines = this.code.split('\n').length
      return `${Math.max(120, 20 * (1 + lines))}px`
    },
    jsonEditorHeight () {
      const lines = this.config.split('\n').length
      return `${Math.max(120, 20 * (1 + lines))}px`
    }
  },
  watch: {
    serializedString (serializedString) {
      if (typeof window !== 'undefined') {
        window.location.replace(`#${serializedString}`)
      }
    },
    async editorHeight () {
      await this.$nextTick()
      this.$refs.editor.codeEditor.layout()
      if (this.$refs.editor.fixedCodeEditor) {
        this.$refs.editor.fixedCodeEditor.layout()
      }
    },
    async jsonEditorHeight () {
      await this.$nextTick()
      this.$refs.jsonEditor.editor.layout()
    }
  },
  mounted () {
    // Load linter asynchronously.
    this.loadEslint()
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', this.onUrlHashChange)
    }
  },
  beforeDestroey () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('hashchange', this.onUrlHashChange)
    }
  },
  methods: {
    async loadEslint () {
      const [
        { default: Linter },
        { parseForESLint }
      ] = await Promise.all([
        import('eslint4b/dist/linter'),
        import('espree').then(() => import('vue-eslint-parser'))
      ])

      const linter = (this.linter = new Linter())

      for (const ruleId of Object.keys(rules)) {
        linter.defineRule(`vue/${ruleId}`, rules[ruleId])
      }

      linter.defineParser('vue-eslint-parser', { parseForESLint })
    },
    onUrlHashChange () {
      const serializedString =
                (typeof window !== 'undefined' &&
                    window.location.hash.slice(1)) ||
                ''
      if (serializedString !== this.serializedString) {
        const state = deserializeState(serializedString)
        this.code = state.code || CODE_DEFAULT
        this.config = state.config || CONFIG_DEFAULT
        this.filename = state.filename || FILENAME_DEFAULT
      }
    },
    onChange ({ messages }) {
      this.messages = messages || []
    }
  }
}

function parseAndResolveConfig (str) {
  let config = null
  try {
    config = JSON.parse(stripComments(str))
  } catch (e) {
    try {
      config = yaml.safeLoad(stripComments(str))
    } catch (_e) {
      throw e
    }
  }
  return resolveConfig(config)
}

</script>
<style scoped>
.playground {
    width: 100%;
    margin: 1em 0;
}
.playground__editor {
    margin: 1em 0;
    max-height: calc(100vh - 200px);
}
.playground__tools {
    display: flex;
}
.playground__json-editor {
    width: 50%;
    max-height: calc(100vh - 200px);
}
.playground__messages {
    width: 50%;
    padding: 0 1em 0 4em;
    margin: 0;
    font-size: 0.8rem;
    max-height: calc(100vh - 200px);
    overflow: auto;
}
</style>
