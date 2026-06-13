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
    /** 进度值 (0-100) */
    Progress: {
        type: Number,
        default: 0,
    },
    /** 是否显示进度 */
    ShowProgress: {
        type: Boolean,
        default: false,
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: String,
    /** 标题/提示 */
    ToolTip: String,
});

const emit = defineEmits(["click", "contextMenu"]);

const isPressed = ref(false);
const isHovered = ref(false);
const isVisible = ref(true);

const disabled = computed(() => !props.IsEnabled);

// 计算进度高度
const progressHeight = computed(() =>
    props.ShowProgress ? Math.max(0, Math.min(100, props.Progress)) : 0
);

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

const handleContextMenu = (event) => {
    event.preventDefault();
    if (!disabled.value) emit("contextMenu", event);
};

const iconSize = computed(() => props.LogoScale * 16);
</script>

<template>
    <button
        type="button"
        :title="ToolTip"
        class="p-extra-button"
        :class="[className, { 'p-extra-button--disabled': disabled }]"
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
            class="p-extra-button__bg"
            :class="{ 'p-extra-button__bg--pressed': isPressed }" />

        <!-- 进度层 -->
        <div
            v-if="ShowProgress"
            class="p-extra-button__progress"
            :style="{ height: `${progressHeight}%` }" />

        <!-- 图标 -->
        <div class="p-extra-button__icon-wrapper">
            <svg
                class="p-extra-button__icon"
                :class="{ 'p-extra-button__icon--disabled': disabled }"
                :width="iconSize"
                :height="iconSize"
                viewBox="0 0 24 24"
                fill="currentColor"
                :style="{
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                }">
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
    overflow: hidden;
    border: none;
    outline: none;
    cursor: pointer;
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-extra-button:focus-visible {
    box-shadow: 0 0 0 2px #60a5fa;
}

.p-extra-button--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.p-extra-button__bg {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background-color: #60a5fa;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 150ms;
}

.p-extra-button__bg--pressed {
    background-color: #3b82f6;
}

.p-extra-button__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.3);
    transition: height 300ms;
}

.p-extra-button__icon-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-extra-button__icon {
    color: white;
    transition: transform 80ms ease-out;
}

.p-extra-button__icon--disabled {
    color: rgba(255, 255, 255, 0.5);
}
</style>
