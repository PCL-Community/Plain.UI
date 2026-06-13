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
    Logo: "",
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

const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        :title="ToolTip || Text"
        class="p-extra-text-button"
        :class="[className, { disabled }]"
        :style="{
            transform: isPressed ? 'scale(0.96)' : 'scale(1)',
        }"
        :disabled="disabled"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 背景层 -->
        <div
            class="p-extra-text-button-bg"
            :class="{ pressed: isPressed }"
        />

        <!-- 图标 -->
        <svg
            v-if="Logo"
            class="p-extra-text-button-icon"
            :class="{ disabled }"
            :style="{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
            }"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 文本 -->
        <span
            class="p-extra-text-button-text"
            :class="{ disabled }">
            {{ Text }}
        </span>
    </button>
</template>

<style scoped>
.p-extra-text-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    border-radius: 9999px;
    border: none;
    overflow: hidden;
    outline: none;
    cursor: pointer;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-extra-text-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-extra-text-button.disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-extra-text-button-bg {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background-color: #60a5fa;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 150ms;
}

.p-extra-text-button-bg.pressed {
    background-color: #3b82f6;
}

.p-extra-text-button-icon {
    position: relative;
    z-index: 10;
    color: white;
    transition: transform 80ms ease-out;
}

.p-extra-text-button-icon.disabled {
    color: rgba(255, 255, 255, 0.5);
}

.p-extra-text-button-text {
    position: relative;
    z-index: 10;
    font-size: 16px;
    font-weight: 500;
    color: white;
}

.p-extra-text-button-text.disabled {
    color: rgba(255, 255, 255, 0.5);
}
</style>
