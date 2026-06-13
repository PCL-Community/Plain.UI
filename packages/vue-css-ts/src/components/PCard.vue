<script setup lang="ts">
import { ref, computed, useSlots } from "vue";

export interface PCardProps {
    /** 标题 */
    Title?: string;
    /** 是否可折叠 */
    CanSwap?: boolean;
    /** 是否已折叠 */
    IsSwapped?: boolean;
    /** 折叠高度 */
    SwapedHeight?: number;
    /** 是否禁用鼠标动画 */
    HasMouseAnimation?: boolean;
    /** 圆角 */
    CornerRadius?: number;
    /** 自定义类名 */
    className?: string;
    /** 折叠状态变更事件 */
    onSwap?: (isSwapped: boolean) => void;
}

const props = withDefaults(defineProps<PCardProps>(), {
    Title: "",
    CanSwap: false,
    IsSwapped: undefined,
    SwapedHeight: 40,
    HasMouseAnimation: true,
    CornerRadius: 5,
    className: "",
});

const emit = defineEmits<{
    swap: [isSwapped: boolean];
}>();

const internalSwapped = ref(false);
const isHovered = ref(false);
const isPressed = ref(false);

const slots = useSlots();

const isSwapped = computed(() => props.IsSwapped !== undefined ? props.IsSwapped : internalSwapped.value);
const showSwapArrow = computed(() => props.CanSwap || !!slots.default);

const handleToggleSwap = () => {
    if (!showSwapArrow.value) return;

    const newState = !isSwapped.value;
    if (props.IsSwapped === undefined) {
        internalSwapped.value = newState;
    }
    props.onSwap?.(newState);
    emit("swap", newState);
};

const handleMouseEnter = () => {
    if (props.HasMouseAnimation) isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
    isPressed.value = false;
};

const handleMouseDown = () => {
    isPressed.value = true;
};

const handleMouseUp = () => {
    isPressed.value = false;
};

// 阴影颜色
const boxShadow = computed(() => {
    return isHovered.value
        ? "0 4px 20px rgba(96, 165, 250, 0.4)" // 蓝色阴影
        : "0 4px 20px rgba(96, 165, 250, 0.1)"; // 淡蓝色阴影
});

// 标题颜色
const titleColor = computed(() => {
    return isHovered.value ? "#3b82f6" : "#60a5fa"; // blue-500 : blue-400
});

// 箭头颜色
const arrowColor = computed(() => {
    return isHovered.value ? "#3b82f6" : "#60a5fa"; // blue-500 : blue-400
});
</script>

<template>
    <div
        class="p-card"
        :class="className"
        :style="{
            borderRadius: `${CornerRadius}px`,
            boxShadow: boxShadow,
            height: isSwapped ? `${SwapedHeight}px` : 'auto',
            minHeight: isSwapped ? `${SwapedHeight}px` : undefined,
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 标题栏 -->
        <div
            class="p-card-header"
            :class="{ clickable: showSwapArrow }"
            @click="showSwapArrow ? handleToggleSwap() : undefined"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp">
            <span
                v-if="Title"
                class="p-card-title"
                :style="{ color: titleColor }">
                {{ Title }}
            </span>

            <!-- 折叠箭头 -->
            <svg
                v-if="showSwapArrow"
                class="p-card-arrow"
                :style="{
                    color: arrowColor,
                    transform: isSwapped ? 'rotate(-90deg)' : 'rotate(0deg)',
                }"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
        </div>

        <!-- 内容区域 -->
        <div
            class="p-card-content"
            :class="{ swapped: isSwapped }"
            :style="{
                maxHeight: isSwapped ? 0 : 'none',
                overflow: isSwapped ? 'hidden' : 'visible',
            }">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.p-card {
    position: relative;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
    transition: all 300ms;
}

.p-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
}

.p-card-header.clickable {
    cursor: pointer;
}

.p-card-title {
    font-size: 13px;
    font-weight: bold;
    transition: color 200ms;
}

.p-card-arrow {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    margin-left: 8px;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms;
}

.p-card-content {
    padding: 0 16px 16px;
    transition: all 300ms;
}

.p-card-content.swapped {
    opacity: 0;
    pointer-events: none;
}
</style>
