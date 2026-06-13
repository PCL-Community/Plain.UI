<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 标题 */
    Title: {
        type: String,
        default: "",
    },
    /** 是否可折叠 */
    CanSwap: {
        type: Boolean,
        default: false,
    },
    /** 是否已折叠 */
    IsSwapped: {
        type: Boolean,
        default: undefined,
    },
    /** 折叠高度 */
    SwapedHeight: {
        type: Number,
        default: 40,
    },
    /** 是否禁用鼠标动画 */
    HasMouseAnimation: {
        type: Boolean,
        default: true,
    },
    /** 圆角 */
    CornerRadius: {
        type: Number,
        default: 5,
    },
    /** 自定义类名 */
    className: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["swap"]);

const internalSwapped = ref(false);
const isHovered = ref(false);
const isPressed = ref(false);

const isSwapped = computed(() => (props.IsSwapped !== undefined ? props.IsSwapped : internalSwapped.value));
const showSwapArrow = computed(() => props.CanSwap || !!props.Title);

const handleToggleSwap = () => {
    if (!showSwapArrow.value) return;

    const newState = !isSwapped.value;
    if (props.IsSwapped === undefined) {
        internalSwapped.value = newState;
    }
    emit("swap", newState);
};

const handleMouseEnter = () => {
    if (props.HasMouseAnimation) isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
    isPressed.value = false;
};

const handleMouseDown = () => {
    isPressed.value = true;
};

const handleMouseUp = () => {
    isPressed.value = false;
};
</script>

<template>
    <div
        :class="['relative overflow-hidden transition-all duration-300', 'bg-white/50 backdrop-blur-sm', className]"
        :style="{
            borderRadius: `${CornerRadius}px`,
            boxShadow: isHovered
                ? '0 4px 20px rgba(96, 165, 250, 0.4)' // 蓝色阴影
                : '0 4px 20px rgba(96, 165, 250, 0.1)', // 淡蓝色阴影
            height: isSwapped ? `${SwapedHeight}px` : 'auto',
            minHeight: isSwapped ? `${SwapedHeight}px` : undefined,
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 标题栏 -->
        <div
            :class="['flex items-center justify-between px-4 py-3', showSwapArrow && 'cursor-pointer']"
            @click="showSwapArrow ? handleToggleSwap() : undefined"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp">
            <span
                v-if="Title"
                :class="[
                    'text-[13px] font-bold transition-colors duration-200',
                    isHovered ? 'text-blue-500' : 'text-blue-400',
                ]">
                {{ Title }}
            </span>

            <!-- 折叠箭头 -->
            <svg
                v-if="showSwapArrow"
                :class="[
                    'w-3 h-3 transition-all duration-250 shrink-0 ml-2',
                    isHovered ? 'text-blue-500' : 'text-blue-400',
                ]"
                viewBox="0 0 24 24"
                fill="currentColor"
                :style="{
                    transform: isSwapped ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                }">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
        </div>

        <!-- 内容区域 -->
        <div
            :class="['px-4 pb-4 transition-all duration-300', isSwapped && 'opacity-0 pointer-events-none']"
            :style="{
                maxHeight: isSwapped ? 0 : 'none',
                overflow: isSwapped ? 'hidden' : 'visible',
            }">
            <slot />
        </div>
    </div>
</template>
