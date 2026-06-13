<script setup>
import { ref, computed, useSlots } from "vue";

const props = defineProps({
    /** 标题 */
    Title: String,
    /** 是否可折叠 */
    CanSwap: {
        type: Boolean,
        default: false,
    },
    /** 是否已折叠 */
    IsSwapped: {
        type: Boolean,
        default: undefined,
    },
    /** 折叠高度 */
    SwapedHeight: {
        type: Number,
        default: 40,
    },
    /** 是否禁用鼠标动画 */
    HasMouseAnimation: {
        type: Boolean,
        default: true,
    },
    /** 圆角 */
    CornerRadius: {
        type: Number,
        default: 5,
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["swap"]);

const internalSwapped = ref(false);
const isHovered = ref(false);
const isPressed = ref(false);

const slots = useSlots();

const isSwapped = computed(() =>
    props.IsSwapped !== undefined ? props.IsSwapped : internalSwapped.value
);

const showSwapArrow = computed(() => props.CanSwap || !!slots.default);

const handleToggleSwap = () => {
    if (!showSwapArrow.value) return;

    const newState = !isSwapped.value;
    if (props.IsSwapped === undefined) {
        internalSwapped.value = newState;
    }
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

// 标题颜色
const titleColor = computed(() =>
    isHovered.value ? "#3b82f6" : "#60a5fa"
);

// 箭头颜色
const arrowColor = computed(() =>
    isHovered.value ? "#3b82f6" : "#60a5fa"
);
</script>

<template>
    <div
        class="p-card"
        :class="className"
        :style="{
            borderRadius: `${CornerRadius}px`,
            boxShadow: isHovered
                ? '0 4px 20px rgba(96, 165, 250, 0.4)'
                : '0 4px 20px rgba(96, 165, 250, 0.1)',
            height: isSwapped ? `${SwapedHeight}px` : 'auto',
            minHeight: isSwapped ? `${SwapedHeight}px` : undefined,
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 标题栏 -->
        <div
            class="p-card__header"
            :class="{ 'p-card__header--clickable': showSwapArrow }"
            @click="showSwapArrow ? handleToggleSwap() : undefined"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp">
            <span
                v-if="Title"
                class="p-card__title"
                :style="{ color: titleColor }">
                {{ Title }}
            </span>

            <!-- 折叠箭头 -->
            <svg
                v-if="showSwapArrow"
                class="p-card__arrow"
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
            class="p-card__content"
            :class="{ 'p-card__content--swapped': isSwapped }"
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

.p-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
}

.p-card__header--clickable {
    cursor: pointer;
}

.p-card__title {
    font-size: 13px;
    font-weight: 700;
    transition: color 200ms;
}

.p-card__arrow {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    margin-left: 8px;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms;
}

.p-card__content {
    padding: 0 16px 16px;
    transition: all 300ms;
}

.p-card__content--swapped {
    opacity: 0;
    pointer-events: none;
}
</style>
