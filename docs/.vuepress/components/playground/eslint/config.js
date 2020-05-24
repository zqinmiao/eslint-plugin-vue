
export function resolveConfig (baseConfig) {
  const config = resolveExtends({ ...baseConfig })

  if (config.parser) {
    config.parser = resolveParser(config.parser)
  }
  return config
}

function resolveExtends (config) {
  if (!config.extends) {
    return config
  }
  const extendList = Array.isArray(config.extends)
    ? config.extends
    : [config.extends]

  const merged = { env: {}, globals: {}, parserOptions: {}, settings: {}, plugins: [], rules: {}}
  for (const extendConfig of extendList.map(configName => resolveExtends(getConfig(configName)))) {
    mergeConfig(merged, extendConfig)
  }
  mergeConfig(merged, config)

  return merged
}

function resolveParser (parser) {
  if (parser === require.resolve('vue-eslint-parser')) {
    return 'vue-eslint-parser'
  }
  return parser
}

function mergeConfig (config, element) {
  // Adopt the parser which was found at first.
  if (!config.parser && element.parser) {
    if (element.parser.error) {
      throw element.parser.error
    }
    config.parser = element.parser
  }

  // Adopt the processor which was found at first.
  if (!config.processor && element.processor) {
    config.processor = element.processor
  }

  // Adopt the noInlineConfig which was found at first.
  if (config.noInlineConfig === void 0 && element.noInlineConfig !== void 0) {
    config.noInlineConfig = element.noInlineConfig
    config.configNameOfNoInlineConfig = element.name
  }

  // Adopt the reportUnusedDisableDirectives which was found at first.
  if (config.reportUnusedDisableDirectives === void 0 && element.reportUnusedDisableDirectives !== void 0) {
    config.reportUnusedDisableDirectives = element.reportUnusedDisableDirectives
  }

  // Merge others.
  mergeWithoutOverwrite(config.env, element.env)
  mergeWithoutOverwrite(config.globals, element.globals)
  mergeWithoutOverwrite(config.parserOptions, element.parserOptions)
  mergeWithoutOverwrite(config.settings, element.settings)
  // mergePlugins(config.plugins, element.plugins)
  mergeRuleConfigs(config.rules, element.rules)
}

function mergeWithoutOverwrite (target, source) {
  if (!isNonNullObject(source)) {
    return
  }

  for (const key of Object.keys(source)) {
    if (key === '__proto__') {
      continue
    }

    if (isNonNullObject(target[key])) {
      mergeWithoutOverwrite(target[key], source[key])
    } else if (target[key] === void 0) {
      if (isNonNullObject(source[key])) {
        target[key] = Array.isArray(source[key]) ? [] : {}
        mergeWithoutOverwrite(target[key], source[key])
      } else if (source[key] !== void 0) {
        target[key] = source[key]
      }
    }
  }
}

/**
 * Merge rule configs.
 * `target`'s definition is prior to `source`'s.
 * @param {Record<string, Array>} target The destination to merge
 * @param {Record<string, RuleConf>|undefined} source The source to merge.
 * @returns {void}
 */
function mergeRuleConfigs (target, source) {
  if (!isNonNullObject(source)) {
    return
  }

  for (const key of Object.keys(source)) {
    if (key === '__proto__') {
      continue
    }
    const targetDef = target[key]
    const sourceDef = source[key]

    // Adopt the rule config which was found at first.
    if (targetDef === void 0) {
      if (Array.isArray(sourceDef)) {
        target[key] = [...sourceDef]
      } else {
        target[key] = [sourceDef]
      }

      /*
       * If the first found rule config is severity only and the current rule
       * config has options, merge the severity and the options.
       */
    } else if (
      targetDef.length === 1 &&
          Array.isArray(sourceDef) &&
          sourceDef.length >= 2
    ) {
      targetDef.push(...sourceDef.slice(1))
    }
  }
}
function isNonNullObject (x) {
  return typeof x === 'object' && x !== null
}

function getConfig (name) {
  if (name.startsWith('eslint:')) {
    return getEslintCoreConfig(name)
  } else if (name.startsWith('plugin:')) {
    const pluginName = name.slice(7, name.lastIndexOf('/'))
    const configName = name.slice(name.lastIndexOf('/') + 1)

    const packageName = normalizePackageName(pluginName, 'eslint-plugin')
    if (packageName !== 'eslint-plugin-vue') {
      throw new Error(`This DEMO does not support ${packageName}.`)
    }
    const config = require('../../../../..').configs[configName]
    if (config) {
      return config
    }
    throw new Error(`Config not found: ${name}.`)
  }

  if (name === require.resolve('../../../../../lib/configs/base')) {
    return require('../../../../../lib/configs/base')
  }
  if (name === require.resolve('../../../../../lib/configs/essential')) {
    return require('../../../../../lib/configs/essential')
  }
  if (name === require.resolve('../../../../../lib/configs/no-layout-rules')) {
    return require('../../../../../lib/configs/no-layout-rules')
  }
  if (name === require.resolve('../../../../../lib/configs/recommended')) {
    return require('../../../../../lib/configs/recommended')
  }
  if (name === require.resolve('../../../../../lib/configs/strongly-recommended')) {
    return require('../../../../../lib/configs/strongly-recommended')
  }
  if (name === require.resolve('../../../../../lib/configs/vue3-essential')) {
    return require('../../../../../lib/configs/vue3-essential')
  }
  if (name === require.resolve('../../../../../lib/configs/vue3-recommended')) {
    return require('../../../../../lib/configs/vue3-recommended')
  }
  if (name === require.resolve('../../../../../lib/configs/vue3-strongly-recommended')) {
    return require('../../../../../lib/configs/vue3-strongly-recommended')
  }

  // } else if (isFilePath(name)) {
  // If the `extends` path is relative, use the directory of the current configuration
  // file as the reference point. Otherwise, use as-is.
  // extensionPath = path.isAbsolute(name)
  //     ? name
  //     : path.join(relativeTo || path.dirname(filePath), name)
  // return require(name)
  // }
  throw new Error(`This DEMO does not support ${name}.`)
  // const packageName = normalizePackageName(name, 'eslint-config')
  // throw new Error(`This DEMO does not support ${packageName}.`)
}

/**
 * Resolves a eslint core config path
 * @param {string} name The eslint config name.
 * @returns {string} The resolved path of the config.
 * @private
 */
function getEslintCoreConfig (name) {
  if (name === 'eslint:recommended') {
    // Add an explicit substitution for eslint:recommended to
    // conf/eslint-recommended.js.
    return require('eslint/conf/eslint-recommended')
  }

  if (name === 'eslint:all') {
    // Add an explicit substitution for eslint:all to conf/eslint-all.js
    return require('eslint/conf/eslint-all')
  }

  throw new Error(`Failed to load config "${name}" to extend from.`)
}

/**
 * Brings package name to correct format based on prefix
 * @param {string} name The name of the package.
 * @param {string} prefix Can be either "eslint-plugin", "eslint-config" or "eslint-formatter"
 * @returns {string} Normalized name of the package
 * @private
 */
function normalizePackageName (name, prefix) {
  let normalizedName = name

  if (normalizedName.charAt(0) === '@') {
    /**
       * it's a scoped package
       * package name is the prefix, or just a username
       */
    const scopedPackageShortcutRegex = new RegExp(
      `^(@[^/]+)(?:/(?:${prefix})?)?$`,
      'u'
    )
    const scopedPackageNameRegex = new RegExp(`^${prefix}(-|$)`, 'u')

    if (scopedPackageShortcutRegex.test(normalizedName)) {
      normalizedName = normalizedName.replace(
        scopedPackageShortcutRegex,
        `$1/${prefix}`
      )
    } else if (!scopedPackageNameRegex.test(normalizedName.split('/')[1])) {
      /**
           * for scoped packages, insert the prefix after the first / unless
           * the path is already @scope/eslint or @scope/eslint-xxx-yyy
           */
      normalizedName = normalizedName.replace(
        /^@([^/]+)\/(.*)$/u,
        `@$1/${prefix}-$2`
      )
    }
  } else if (normalizedName.indexOf(`${prefix}-`) !== 0) {
    normalizedName = `${prefix}-${normalizedName}`
  }

  return normalizedName
}
