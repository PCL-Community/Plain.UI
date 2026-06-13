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
    Logo: "",
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
</script>

<template>
    <button
        type="button"
        :title="props.ToolTip"
        :class="[
            'relative w-10 h-10 rounded-full overflow-hidden',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            props.className,
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
            }"
        />

        <!-- 进度层 -->
        <div
            v-if="props.ShowProgress"
            class="absolute bottom-0 left-0 right-0 bg-white/30 transition-all duration-300"
            :style="{
                height: `${progressHeight}%`,
            }"
        />

        <!-- 图标 -->
        <div class="absolute inset-0 flex items-center justify-center">
            <svg
                :class="['transition-all duration-150', disabled ? 'text-white/50' : 'text-white']"
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
        </div>
    </button>
</template>
