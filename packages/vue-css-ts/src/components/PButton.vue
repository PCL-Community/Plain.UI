<script setup lang="ts">
import { ref, computed } from "vue";

export type PButtonColorState = "Normal" | "Highlight" | "Red";

export interface PButtonProps {
    /** 按钮文本 */
    Text?: string;
    /** 颜色状态 */
    ColorState?: PButtonColorState;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 内边距 */
    Padding?: string;
    /** 点击事件 */
    onClick?: (event: MouseEvent) => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PButtonProps>(), {
    Text: "",
    ColorState: "Normal",
    IsEnabled: true,
    Padding: "6px 12px",
    className: "",
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

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

const handleClick = (event: MouseEvent) => {
    if (!disabled.value) {
        props.onClick?.(event);
        emit("click", event);
    }
};

// 根据 ColorState 和状态确定边框颜色
const borderColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400

    switch (props.ColorState) {
        case "Normal":
            return isHovered.value ? "#3b82f6" : "#60a5fa"; // blue-500 : blue-400
        case "Highlight":
            return isHovered.value ? "#3b82f6" : "#93c5fd"; // blue-500 : blue-300
        case "Red":
            return isHovered.value ? "#f87171" : "#ef4444"; // red-400 : red-500
        default:
            return "#60a5fa";
    }
});

// 根据 ColorState 和状态确定背景色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6"; // gray-100

    if (isPressed.value) {
        switch (props.ColorState) {
            case "Red":
                return "#fef2f2"; // red-50
            default:
                return "#eff6ff"; // blue-50
        }
    }

    if (isHovered.value) {
        switch (props.ColorState) {
            case "Red":
                return "#fef2f2"; // red-50
            default:
                return "#eff6ff"; // blue-50
        }
    }

    return "rgba(255, 255, 255, 0.5)";
});

// 文本颜色
const textColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400

    switch (props.ColorState) {
        case "Normal":
            return isHovered.value ? "#3b82f6" : "#60a5fa"; // blue-500 : blue-400
        case "Highlight":
            return isHovered.value ? "#3b82f6" : "#93c5fd"; // blue-500 : blue-300
        case "Red":
            return isHovered.value ? "#f87171" : "#ef4444"; // red-400 : red-500
        default:
            return "#60a5fa";
    }
});
</script>

<template>
    <button
        class="p-button"
        :class="[className, { disabled }]"
        :style="{
            padding: Padding,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            transform: isPressed ? 'scale(0.955)' : 'scale(1)',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <span
            class="p-button-text"
            :style="{
                color: textColor,
                transform: isPressed ? 'scale(0.99)' : 'scale(1)',
            }">
            <slot>{{ Text }}</slot>
        </span>
    </button>
</template>

<style scoped>
.p-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 1px solid;
    transition: transform 80ms ease-out, background-color 200ms, border-color 200ms;
    outline: none;
    cursor: pointer;
}

.p-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-button.disabled {
    cursor: not-allowed;
}

.p-button-text {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: transform 80ms ease-out, color 200ms;
}
</style>
