<script setup lang="ts">
import { ref, computed } from "vue";

export interface PListItemProps {
    /** 标题 */
    Title: string;
    /** 信息/副标题 */
    Info?: string;
    /** 图标 (SVG path) */
    Logo?: string;
    /** 是否选中 */
    Checked?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 点击事件 */
    onClick?: () => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PListItemProps>(), {
    Title: "",
    Info: "",
    Logo: "",
    Checked: false,
    IsEnabled: true,
    className: "",
});

const emit = defineEmits<{
    click: [];
}>();

const isHovered = ref(false);
const isPressed = ref(false);

const disabled = computed(() => !props.IsEnabled);

const handleClick = () => {
    if (!disabled.value) {
        props.onClick?.();
        emit("click");
    }
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
    isPressed.value = false;
};

const handleMouseDown = () => {
    if (!disabled.value) isPressed.value = true;
};

const handleMouseUp = () => {
    isPressed.value = false;
};
</script>

<template>
    <div
        :class="[
            'flex items-center h-10.5 px-2 rounded-[3px] transition-all duration-150',
            'cursor-pointer select-none',
            disabled && 'cursor-not-allowed opacity-50',
            isHovered && !disabled && 'bg-blue-50',
            props.className,
        ]"
        :style="{
            transform: isPressed ? 'scale(0.995)' : 'scale(1)',
            transition: 'transform 80ms ease-out, background-color 150ms',
        }"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp">
        <!-- 左侧指示条 -->
        <div
            :class="[
                'w-0.5 h-6 rounded-full mr-2 transition-all duration-200',
                props.Checked ? 'bg-blue-400' : 'bg-transparent',
            ]"
        />

        <!-- 图标 -->
        <svg
            v-if="props.Logo"
            :class="[
                'w-4 h-4 mr-3 shrink-0 transition-colors duration-150',
                props.Checked ? 'text-blue-400' : 'text-gray-400',
                isHovered && !disabled && !props.Checked && 'text-blue-300',
            ]"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="props.Logo" />
        </svg>

        <!-- 内容区域 -->
        <div class="flex-1 min-w-0">
            <div
                :class="[
                    'text-[14px] truncate transition-colors duration-150',
                    props.Checked ? 'text-blue-500 font-medium' : 'text-gray-700',
                    isHovered && !disabled && !props.Checked && 'text-blue-400',
                ]">
                {{ props.Title }}
            </div>
            <div v-if="props.Info" class="text-[12px] text-gray-400 truncate">{{ props.Info }}</div>
        </div>
    </div>
</template>
