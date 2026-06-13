<script setup lang="ts">
import { ref, computed } from "vue";

export interface PExtraButtonProps {
    /** 图标 (SVG path) */
    Logo: string;
    /** 图标大小 */
    LogoScale?: number;
    /** 进度值 (0-100) */
    Progress?: number;
    /** 是否显示进度 */
    ShowProgress?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: (event: MouseEvent) => void;
    /** 右键点击事件 */
    onContextMenu?: (event: MouseEvent) => void;
    /** 自定义类名 */
    className?: string;
    /** 标题/提示 */
    ToolTip?: string;
}

const props = withDefaults(defineProps<PExtraButtonProps>(), {
    LogoScale: 1,
    Progress: 0,
    ShowProgress: false,
    IsEnabled: true,
    className: "",
    ToolTip: "",
});

const emit = defineEmits<{
    click: [event: MouseEvent];
    contextMenu: [event: MouseEvent];
}>();

const disabled = computed(() => !props.IsEnabled);
const isPressed = ref(false);
const isHovered = ref(false);
const isVisible = ref(true);

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

const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    if (!disabled.value) {
        props.onContextMenu?.(event);
        emit("contextMenu", event);
    }
};

// 计算进度高度
const progressHeight = computed(() => {
    return props.ShowProgress ? Math.max(0, Math.min(100, props.Progress)) : 0;
});

const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        :title="ToolTip"
        class="p-extra-button"
        :class="[className, { disabled }]"
        :style="{
            transform: isPressed ? 'scale(0.92)' : isVisible ? 'scale(1)' : 'scale(0)',
        }"
        :disabled="disabled"
        @click="handleClick"
        @contextmenu="handleContextMenu"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 背景层 -->
        <div
            class="p-extra-button-bg"
            :class="{ pressed: isPressed }"
        />

        <!-- 进度层 -->
        <div
            v-if="ShowProgress"
            class="p-extra-button-progress"
            :style="{ height: `${progressHeight}%` }"
        />

        <!-- 图标 -->
        <div class="p-extra-button-icon-wrapper">
            <svg
                class="p-extra-button-icon"
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
        </div>
    </button>
</template>

<style scoped>
.p-extra-button {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    overflow: hidden;
    outline: none;
    cursor: pointer;
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-extra-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-extra-button.disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-extra-button-bg {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: #60a5fa;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 150ms;
}

.p-extra-button-bg.pressed {
    background-color: #3b82f6;
}

.p-extra-button-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.3);
    transition: height 300ms;
}

.p-extra-button-icon-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-extra-button-icon {
    color: white;
    transition: transform 80ms ease-out;
}

.p-extra-button-icon.disabled {
    color: rgba(255, 255, 255, 0.5);
}
</style>
