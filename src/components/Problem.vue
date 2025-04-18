<script setup>
import { inject } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import MarkdownPreview from '@/components/MarkdownPreview'

defineProps(['problem'])
const { t } = useI18n()
const $Message = inject('$Message')
const { copy } = useClipboard()

function onCopy(content) {
  copy(content)
  $Message.success('Copied!')
}
</script>

<template>
  <div class="proinfo-wrap">
    <h1>
      <slot name="title">
        {{ problem.pid }}: {{ problem.title }}
      </slot>
    </h1>
    <h5>Time Limit: {{ problem.time }}MS&nbsp;&nbsp;&nbsp;Memory Limit: {{ problem.memory }}KB</h5>
    <h2 class="text-primary">{{ t('oj.description') }}</h2>
    <MarkdownPreview class="cont" v-model="problem.description" />
    <h2>{{ t('oj.input') }}</h2>
    <MarkdownPreview class="cont" v-model="problem.input" />
    <h2>{{ t('oj.output') }}</h2>
    <MarkdownPreview class="cont" v-model="problem.output" />
    <h2>
      {{ t('oj.sample_input') }}
      <Tooltip content="Click to copy" placement="top">
        <Icon type="ios-document-outline" style="cursor: pointer" @click="onCopy(problem.in)" />
      </Tooltip>
    </h2>
    <pre><code>{{ problem.in }}</code></pre>
    <h2>
      {{ t('oj.sample_output') }}
      <Tooltip :content="t('oj.click_to_copy_code')" placement="top">
        <Icon type="ios-document-outline" style="cursor: pointer" @click="onCopy(problem.out)" />
      </Tooltip>
    </h2>
    <pre><code>{{ problem.out }}</code></pre>
    <template v-if="problem.hint?.trim()">
      <h2>
        {{ t('oj.hint') }}
      </h2>
      <MarkdownPreview class="cont" v-model="problem.hint" />
    </template>
  </div>
</template>

<style lang="stylus" scoped>
h1
  margin-top: 10px
  margin-bottom: 8px
  text-align: center
h5
  margin-bottom: 10px
  text-align:center
h2
  border-bottom: 1px solid #e8e8e8
  padding: 10px 0
.cont
  margin-top: 10px
  margin-bottom: 20px
pre
  padding: 10px
  border-radius: 5px
  background-color: #ECEFF1
</style>
