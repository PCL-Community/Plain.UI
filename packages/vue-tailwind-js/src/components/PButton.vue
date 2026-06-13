<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 按钮文本 */
    Text: {
        type: String,
        default: "",
    },
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
    className: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["click"]);

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

const handleClick = (event) => {
    if (!disabled.value) emit("click", event);
};

// 根据 ColorState 和状态确定边框颜色
const getBorderColor = () => {
    if (disabled.value) return "border-gray-400";

    switch (props.ColorState) {
        case "Normal":
            return isHovered.value ? "border-blue-500" : "border-blue-400";
        case "Highlight":
            return isHovered.value ? "border-blue-500" : "border-blue-300";
        case "Red":
            return isHovered.value ? "border-red-400" : "border-red-500";
        default:
            return "border-blue-400";
    }
};

// 根据 ColorState 和状态确定背景色
const getBackgroundColor = () => {
    if (disabled.value) return "bg-gray-100";

    if (isPressed.value) {
        switch (props.ColorState) {
            case "Red":
                return "bg-red-50";
            default:
                return "bg-blue-50";
        }
    }

    if (isHovered.value) {
        switch (props.ColorState) {
            case "Red":
                return "bg-red-50";
            default:
                return "bg-blue-50";
        }
    }

    return "bg-white/50";
};

// 文本颜色
const getTextColor = () => {
    if (disabled.value) return "text-gray-400";

    switch (props.ColorState) {
        case "Normal":
            return isHovered.value ? "text-blue-500" : "text-blue-400";
        case "Highlight":
            return isHovered.value ? "text-blue-500" : "text-blue-300";
        case "Red":
            return isHovered.value ? "text-red-400" : "text-red-500";
        default:
            return "text-blue-400";
    }
};

const borderColorClass = computed(getBorderColor);
const backgroundColorClass = computed(getBackgroundColor);
const textColorClass = computed(getTextColor);
</script>

<template>
    <button
        :class="[
            'relative inline-flex items-center justify-center rounded-[3px]',
            'border transition-all duration-200 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            borderColorClass,
            backgroundColorClass,
            className,
        ]"
        :style="{
            padding: Padding,
            transform: isPressed ? 'scale(0.955)' : 'scale(1)',
            transition: 'transform 80ms ease-out, background-color 200ms, border-color 200ms',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <span
            :class="['text-[13px] font-medium whitespace-nowrap', 'transition-colors duration-200', textColorClass]"
            :style="{
                transform: isPressed ? 'scale(0.99)' : 'scale(1)',
                transition: 'transform 80ms ease-out',
            }">
            <slot>{{ Text }}</slot>
        </span>
    </button>
</template>
