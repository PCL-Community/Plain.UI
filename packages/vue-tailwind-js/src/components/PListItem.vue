<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 标题 */
    Title: {
        type: String,
        required: true,
    },
    /** 信息/副标题 */
    Info: {
        type: String,
        default: "",
    },
    /** 图标 (SVG path) */
    Logo: {
        type: String,
        default: "",
    },
    /** 是否选中 */
    Checked: {
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
});

const emit = defineEmits(["click"]);

const disabled = computed(() => !props.IsEnabled);
const isHovered = ref(false);
const isPressed = ref(false);

const handleClick = () => {
    if (!disabled.value) emit("click");
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
            className,
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
                Checked ? 'bg-blue-400' : 'bg-transparent',
            ]" />

        <!-- 图标 -->
        <svg
            v-if="Logo"
            :class="[
                'w-4 h-4 mr-3 shrink-0 transition-colors duration-150',
                Checked ? 'text-blue-400' : 'text-gray-400',
                isHovered && !disabled && !Checked && 'text-blue-300',
            ]"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path :d="Logo" />
        </svg>

        <!-- 内容区域 -->
        <div class="flex-1 min-w-0">
            <div
                :class="[
                    'text-[14px] truncate transition-colors duration-150',
                    Checked ? 'text-blue-500 font-medium' : 'text-gray-700',
                    isHovered && !disabled && !Checked && 'text-blue-400',
                ]">
                {{ Title }}
            </div>
            <div v-if="Info" class="text-[12px] text-gray-400 truncate">{{ Info }}</div>
        </div>
    </div>
</template>
