<script setup lang="ts">
import { ref, computed } from "vue";

export interface PIconTextButtonProps {
    /** 文本 */
    Text: string;
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
}

const props = withDefaults(defineProps<PIconTextButtonProps>(), {
    Text: "",
    Logo: "",
    LogoScale: 1,
    IsEnabled: true,
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
</script>

<template>
    <button
        type="button"
        :class="[
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-[13.5px]',
            'transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-90',
            props.className,
        ]"
        :style="{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            minHeight: '27px',
            maxHeight: '27px',
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 80ms ease-out, opacity 150ms',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 图标 -->
        <svg
            class="text-white shrink-0"
            :width="props.LogoScale * 16"
            :height="props.LogoScale * 16"
            viewBox="0 0 24 24"
            fill="currentColor"
            :style="{
                transform: isPressed ? 'scale(0.92)' : 'scale(1)',
                transition: 'transform 80ms ease-out',
            }">
            <path :d="props.Logo" />
        </svg>

        <!-- 文本 -->
        <span class="text-[13px] text-white whitespace-nowrap">{{ props.Text }}</span>
    </button>
</template>
