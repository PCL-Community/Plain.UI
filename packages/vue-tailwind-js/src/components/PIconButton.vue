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
    className: {
        type: String,
        default: "",
    },
    /** 标题/提示 */
    ToolTip: {
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

// 背景颜色
const getBackgroundColor = () => {
    if (disabled.value) return "bg-gray-100";
    if (isPressed.value) return "bg-blue-100";
    if (isHovered.value) return "bg-blue-50";
    return "bg-transparent";
};

// 图标颜色
const getIconColor = () => {
    if (disabled.value) return "text-gray-400";
    if (isPressed.value) return "text-blue-500";
    if (isHovered.value) return "text-blue-400";
    return "text-blue-400";
};

const backgroundColorClass = computed(getBackgroundColor);
const iconColorClass = computed(getIconColor);
</script>

<template>
    <button
        type="button"
        :title="ToolTip"
        :class="[
            'inline-flex items-center justify-center rounded-full transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            backgroundColorClass,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className,
        ]"
        :style="{
            width: LogoScale * 16 + 10 + 'px',
            height: LogoScale * 16 + 10 + 'px',
            transform: isPressed ? 'scale(0.92)' : 'scale(1)',
            transition: 'transform 80ms ease-out, background-color 150ms',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <svg
            :class="['transition-colors duration-150', iconColorClass]"
            :width="LogoScale * 16"
            :height="LogoScale * 16"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 80ms ease-out',
            }">
            <path :d="Logo" />
        </svg>
    </button>
</template>
