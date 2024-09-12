import { readFileSync } from 'node:fs'
import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, addTemplate } from '@nuxt/kit'

// Module options TypeScript interface definition
export type ModuleOptions = object

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@urassh/network-particle',
    configKey: 'networkParticle',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    addComponentsDir({
      path: resolver.resolve('runtime/components'),
    })

    addTemplate({
      filename: 'particle.config.json',
      getContents: () => {
        return readFileSync(resolver.resolve('runtime/particle.config.json'), 'utf-8')
      },
    })
  },
})
