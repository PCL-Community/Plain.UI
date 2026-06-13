<script setup lang="ts">
import { ref, computed } from "vue";

export interface PIconButtonProps {
    /** 图标 (SVG path) */
    Logo: string;
    /** 图标大小 */
    LogoScale?: number;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: (event: MouseEvent) => void;
    /** 自定义类名 */
    className?: string;
    /** 标题/提示 */
    ToolTip?: string;
}

const props = withDefaults(defineProps<PIconButtonProps>(), {
    LogoScale: 1,
    IsEnabled: true,
    className: "",
    ToolTip: "",
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const disabled = computed(() => !props.IsEnabled);
const isPressed = ref(false);
const isHovered = ref(false);

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

const handleClick = (event: MouseEvent) => {
    if (!disabled.value) {
        props.onClick?.(event);
        emit("click", event);
    }
};

// 背景颜色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6"; // gray-100
    if (isPressed.value) return "#dbeafe"; // blue-100
    if (isHovered.value) return "#eff6ff"; // blue-50
    return "transparent";
});

// 图标颜色
const iconColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    if (isPressed.value) return "#3b82f6"; // blue-500
    if (isHovered.value) return "#60a5fa"; // blue-400
    return "#60a5fa"; // blue-400
});

const buttonSize = computed(() => props.LogoScale * 16 + 10);
const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        :title="ToolTip"
        class="p-icon-button"
        :class="[className, { disabled }]"
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
            class="p-icon-button-svg"
            :style="{
                color: iconColor,
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
            }"
            viewBox="0 0 24 24"
            fill="currentColor">
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

.p-icon-button.disabled {
    cursor: not-allowed;
}

.p-icon-button-svg {
    transition: transform 80ms ease-out;
}
</style>
