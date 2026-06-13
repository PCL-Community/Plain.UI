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

const emit = defineEmits(["click", "contextMenu"]);

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

const handleClick = (event) => {
    if (!disabled.value) emit("click", event);
};

const handleContextMenu = (event) => {
    event.preventDefault();
    if (!disabled.value) emit("contextMenu", event);
};

// 计算进度高度
const progressHeight = computed(() => (props.ShowProgress ? Math.max(0, Math.min(100, props.Progress)) : 0));
</script>

<template>
    <button
        type="button"
        :title="ToolTip"
        :class="[
            'relative w-10 h-10 rounded-full overflow-hidden',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            className,
        ]"
        :style="{
            transform: isPressed ? 'scale(0.92)' : isVisible ? 'scale(1)' : 'scale(0)',
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
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
            :class="[
                'absolute inset-0 rounded-full transition-colors duration-150',
                isPressed ? 'bg-blue-500' : 'bg-blue-400',
            ]"
            :style="{
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            }" />

        <!-- 进度层 -->
        <div
            v-if="ShowProgress"
            class="absolute bottom-0 left-0 right-0 bg-white/30 transition-all duration-300"
            :style="{
                height: `${progressHeight}%`,
            }" />

        <!-- 图标 -->
        <div class="absolute inset-0 flex items-center justify-center">
            <svg
                :class="['transition-all duration-150', disabled ? 'text-white/50' : 'text-white']"
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
        </div>
    </button>
</template>
