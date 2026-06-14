<script setup>
import { ref, computed } from "vue";
import "../styles/theme.css";

const props = defineProps({
    /** 按钮文本 */
    Text: String,
    /** 颜色状态 */
    ColorState: {
        type: String,
        default: "Normal",
        validator: (value) => ["Normal", "Highlight", "Red"].includes(value),
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 内边距 */
    Padding: {
        type: String,
        default: "6px 12px",
    },
    /** 自定义类名 */
    className: String,
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

// 根据 ColorState 和状态确定边框颜色
const borderColor = computed(() => {
    if (disabled.value) return "#9ca3af";

    switch (props.ColorState) {
        case "Normal":
            return isHovered.value ? "#3b82f6" : "#60a5fa";
        case "Highlight":
            return isHovered.value ? "#3b82f6" : "#93c5fd";
        case "Red":
            return isHovered.value ? "#f87171" : "#ef4444";
        default:
            return "#60a5fa";
    }
});

// 根据 ColorState 和状态确定背景色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6";

    if (isPressed.value) {
        switch (props.ColorState) {
            case "Red":
                return "#fef2f2";
            default:
                return "#eff6ff";
        }
    }

    if (isHovered.value) {
        switch (props.ColorState) {
            case "Red":
                return "#fef2f2";
            default:
                return "#eff6ff";
        }
    }

    return "rgba(255, 255, 255, 0.5)";
});

// 文本颜色
const textColor = computed(() => {
    if (disabled.value) return "#9ca3af";

    switch (props.ColorState) {
        case "Normal":
            return isHovered.value ? "#3b82f6" : "#60a5fa";
        case "Highlight":
            return isHovered.value ? "#3b82f6" : "#93c5fd";
        case "Red":
            return isHovered.value ? "#f87171" : "#ef4444";
        default:
            return "#60a5fa";
    }
});
</script>

<template>
    <button
        class="p-button"
        :class="className"
        :disabled="disabled"
        :style="{
            padding: Padding,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            transform: isPressed ? 'scale(0.955)' : 'scale(1)',
        }"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <span
            class="p-button__text"
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
}

.p-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-button__text {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: transform 80ms ease-out, color 200ms;
}
</style>
