<!--
 * @Date: 2023-11-23 17:08:51
 * @Description: message组件
-->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { CSSProperties } from "vue";
import { useTimeoutFn, useResizeObserver } from "@fish-bubble-design/core/shared";
import { getLastOffset } from "./instance";
import FbIcon from "@fish-bubble-design/components/icon";
import type { IMessageProps } from "./type";

const props = withDefaults(defineProps<IMessageProps>(), {
  showClose: false,
  dangerouslyUseHTMLString: false,
  id: "",
  zIndex: 500,
  duration: 3000,
  offset: 20
});

// 销毁时暴露事件destroy
defineEmits<{ (e: "destroy"): void }>();

const messageRef = ref<HTMLDivElement>();
const visible = ref(false);
const height = ref(0);

const icon = computed(() => {
  const iconMap = {
    info: { icon: "yp-gantanhao1", color: "#0092ff" },
    success: { icon: "yp-gougou1", color: "#06B578" },
    warning: { icon: "yp-gantanhao1", color: "#FF8904" },
    error: { icon: "yp-shanchu1", color: "#E8362E" }
  };
  return iconMap[props.type] || iconMap["info"];
});

// 最后一个msg的位置
const lastOffset = computed(() => getLastOffset(props.id));

// 当前msg的top值等于：当前距离顶部的偏移量 + 上一个距离顶部的top值
const offset = computed(() => props.offset + lastOffset.value);

const customStyle = computed<CSSProperties>(() => ({
  top: `${offset.value}px`,
  zIndex: props?.zIndex
}));

// 当前msg的位置：主要是为了下一个msg 获取 当前这个的位置。我们这里暴露下
// 当前的就是当前的msg高度 + 现在的top值
const bottom = computed((): number => height.value + offset.value);

// 时间到了就关闭
const { start } = useTimeoutFn(
  () => {
    close();
  },
  props.duration,
  { immediate: false }
);
// 开启定时器
function startTimer() {
  // 时间不存在，不关闭
  if (props.duration === 0) return;
  start();
}
// 关闭
function close() {
  visible.value = false;
}

onMounted(() => {
  startTimer();
  visible.value = true;
});

useResizeObserver(messageRef, (entries) => {
  height.value = messageRef.value!.getBoundingClientRect().height;
});

// 暴露属性
defineExpose({ bottom, close });
</script>

<template>
  <transition name="yp-message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
    <!-- mouseenter，当鼠标滑动到消息容器上，不关闭消息 -->
    <div v-show="visible" :id="id" :style="customStyle" class="yp-message" ref="messageRef">
      <fb-icon :icon="icon.icon" :size="20" :color="icon.color" />
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="yp-message__content">
          {{ message }}
        </p>
        <p v-else v-html="message" class="yp-message__content" />
      </slot>
      <fb-icon v-if="showClose" icon="yp-danchuangguanbi" @click.stop="close" :size="18" is-pointer color="rgba(0, 0, 0, 0.65)" />
    </div>
  </transition>
</template>

<style lang="less">
.yp-message {
  max-width: 640px;
  min-width: 200px;
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  color: var(--65, rgba(0, 0, 0, 0.65));
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e9edf3;
  background: var(--100, #fff);
  box-shadow: 0px 16px 24px 0px rgba(41, 80, 155, 0.1);
  position: fixed;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  transition:
    opacity 0.3s,
    transform 0.4s,
    top 0.4s;
  &__content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 12px;
  }
}
.yp-message-fade-enter-from,
.yp-message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>