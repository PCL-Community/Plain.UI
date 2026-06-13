<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 文本 */
    Text: {
        type: String,
        required: true,
    },
    /** 图标 (SVG path) */
    Logo: {
        type: String,
        default: "",
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
</script>

<template>
    <button
        type="button"
        :title="ToolTip || Text"
        :class="[
            'relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full overflow-hidden',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            className,
        ]"
        :style="{
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 背景层 -->
        <div
            :class="[
                'absolute inset-0 rounded-full transition-colors duration-150',
                isPressed ? 'bg-blue-500' : 'bg-blue-400',
            ]"
            :style="{
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            }" />

        <!-- 图标 -->
        <svg
            v-if="Logo"
            :class="[
                'relative z-10 transition-all duration-150',
                disabled ? 'text-white/50' : 'text-white',
            ]"
            :width="LogoScale * 16"
            :height="LogoScale * 16"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                transition: 'transform 80ms ease-out',
            }">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span
            :class="[
                'relative z-10 text-[16px] font-medium transition-colors duration-150',
                disabled ? 'text-white/50' : 'text-white',
            ]">
            {{ Text }}
        </span>
    </button>
</template>
