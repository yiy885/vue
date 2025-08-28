<template>
  <div class="cards-grid">
    <n-card v-for="(card, idx) in cards" :key="idx" ref="cardRefs" :title="card.title" hoverable>
      <template #default>{{ card.content }}</template>
      <template #action>
        <n-button type="primary">了解更多</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { NCard, NButton } from 'naive-ui'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

const cards = [
  { title: '卡片一', content: '請按住我拖曳。' },
  { title: '卡片二', content: '請按住我拖曳。' },
  { title: '卡片三', content: '請按住我拖曳。' },
  { title: '卡片四', content: '請按住我拖曳。' },
  { title: '卡片五', content: '請按住我拖曳。' },
  { title: '卡片六', content: '請按住我拖曳。' },
]

const cardRefs = ref([])

onMounted(async () => {
  await nextTick()
  cardRefs.value.forEach((cardComp) => {
    if (cardComp && cardComp.$el) {
      Draggable.create(cardComp.$el, {
        type: 'x,y',
        edgeResistance: 0.65,
        bounds: cardComp.$el.parentNode,
        inertia: true,
        zIndexBoost: true,
      })
    }
  })
})
</script>

<style scoped>
.cards-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  padding: 32px 16px;
}
@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.cards-grid .n-card {
  width: 100%;
  max-width: none;
  border: 1.5px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>
