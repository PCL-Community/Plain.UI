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
    Logo: "",
    LogoScale: 1,
    IsEnabled: true,
    className: "",
    ToolTip: "",
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

// 背景颜色
const backgroundColorClass = computed(() => {
    if (disabled.value) return "bg-gray-100";
    if (isPressed.value) return "bg-blue-100";
    if (isHovered.value) return "bg-blue-50";
    return "bg-transparent";
});

// 图标颜色
const iconColorClass = computed(() => {
    if (disabled.value) return "text-gray-400";
    if (isPressed.value) return "text-blue-500";
    if (isHovered.value) return "text-blue-400";
    return "text-blue-400";
});
</script>

<template>
    <button
        type="button"
        :title="props.ToolTip"
        :class="[
            'inline-flex items-center justify-center rounded-full transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            backgroundColorClass,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            props.className,
        ]"
        :style="{
            width: props.LogoScale * 16 + 10 + 'px',
            height: props.LogoScale * 16 + 10 + 'px',
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
            :width="props.LogoScale * 16"
            :height="props.LogoScale * 16"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 80ms ease-out',
            }">
            <path :d="props.Logo" />
        </svg>
    </button>
</template>
