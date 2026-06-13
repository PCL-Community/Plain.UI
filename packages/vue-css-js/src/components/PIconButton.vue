<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 图标 (SVG path) */
    Logo: {
        type: String,
        required: true,
    },
    /** 图标大小 */
    LogoScale: {
        type: Number,
        default: 1,
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: String,
    /** 标题/提示 */
    ToolTip: String,
});

const emit = defineEmits(["click"]);

const isPressed = ref(false);
const isHovered = ref(false);

const disabled = computed(() => !props.IsEnabled);

const handleMouseDown = () => {
    if (!disabled.value) isPressed.value = true;
};

const handleMouseUp = () => {
    isPressed.value = false;
};

const handleMouseLeave = () => {
    isPressed.value = false;
    isHovered.value = false;
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleClick = (event) => {
    if (!disabled.value) emit("click", event);
};

// 背景颜色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6";
    if (isPressed.value) return "#dbeafe";
    if (isHovered.value) return "#eff6ff";
    return "transparent";
});

// 图标颜色
const iconColor = computed(() => {
    if (disabled.value) return "#9ca3af";
    if (isPressed.value) return "#3b82f6";
    if (isHovered.value) return "#60a5fa";
    return "#60a5fa";
});

const buttonSize = computed(() => props.LogoScale * 16 + 10);
const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        :title="ToolTip"
        class="p-icon-button"
        :class="[className, { 'p-icon-button--disabled': disabled }]"
        :style="{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            backgroundColor: backgroundColor,
            transform: isPressed ? 'scale(0.92)' : 'scale(1)',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <svg
            :width="iconSize"
            :height="iconSize"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                color: iconColor,
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
            }">
            <path :d="Logo" />
        </svg>
    </button>
</template>

<style scoped>
.p-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform 80ms ease-out, background-color 150ms;
}

.p-icon-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-icon-button--disabled {
    cursor: not-allowed;
}
</style>
