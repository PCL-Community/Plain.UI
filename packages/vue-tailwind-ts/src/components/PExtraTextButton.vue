<script setup lang="ts">
import { ref, computed } from "vue";

export interface PExtraTextButtonProps {
    /** 文本 */
    Text: string;
    /** 图标 (SVG path) */
    Logo?: string;
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

const props = withDefaults(defineProps<PExtraTextButtonProps>(), {
    Text: "",
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
</script>

<template>
    <button
        type="button"
        :title="props.ToolTip || props.Text"
        :class="[
            'relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full overflow-hidden',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            props.className,
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
            }"
        />

        <!-- 图标 -->
        <svg
            v-if="props.Logo"
            :class="[
                'relative z-10 transition-all duration-150',
                disabled ? 'text-white/50' : 'text-white',
            ]"
            :width="props.LogoScale * 16"
            :height="props.LogoScale * 16"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                transition: 'transform 80ms ease-out',
            }">
            <path :d="props.Logo" />
        </svg>

        <!-- 文本 -->
        <span
            :class="[
                'relative z-10 text-[16px] font-medium transition-colors duration-150',
                disabled ? 'text-white/50' : 'text-white',
            ]">
            {{ props.Text }}
        </span>
    </button>
</template>
