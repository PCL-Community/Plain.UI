<script setup lang="ts">
import { ref, computed } from "vue";

export interface PCheckBoxProps {
    /** 是否选中 */
    Checked?: boolean | null;
    /** 是否为三态复选框 */
    IsThreeState?: boolean;
    /** 文本 */
    Text?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 变更事件 */
    onChange?: (checked: boolean | null, user: boolean) => void;
    /** 预览变更事件（可取消） */
    onPreviewChange?: (checked: boolean | null) => boolean;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PCheckBoxProps>(), {
    Checked: undefined,
    IsThreeState: false,
    Text: "",
    IsEnabled: true,
    className: "",
});

const emit = defineEmits<{
    change: [checked: boolean | null, user: boolean];
}>();

const internalChecked = ref<boolean | null>(false);
const isPressed = ref(false);
const isHovered = ref(false);

const disabled = computed(() => !props.IsEnabled);
const checked = computed(() => (props.Checked !== undefined ? props.Checked : internalChecked.value));

const getNextState = (current: boolean | null): boolean | null => {
    if (props.IsThreeState) {
        switch (current) {
            case true:
                return null;
            case false:
                return true;
            case null:
                return false;
        }
    }
    return !current;
};

const handleClick = () => {
    if (disabled.value) return;

    const nextState = getNextState(checked.value);

    // 预览事件，可取消
    if (props.onPreviewChange) {
        const allowed = props.onPreviewChange(nextState);
        if (!allowed) return;
    }

    if (props.Checked === undefined) {
        internalChecked.value = nextState;
    }
    props.onChange?.(nextState, true);
    emit("change", nextState, true);
};

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

// 边框颜色
const borderColorClass = computed(() => {
    if (disabled.value) return "border-gray-400";
    if (checked.value === true) return isHovered.value ? "border-blue-500" : "border-blue-400";
    return isHovered.value ? "border-blue-500" : "border-blue-400";
});

// 背景颜色
const backgroundColorClass = computed(() => {
    if (disabled.value) return "bg-gray-100";
    if (isPressed.value && checked.value === true) return "bg-blue-100";
    return "bg-white/50";
});

// 文本颜色
const textColorClass = computed(() => {
    if (disabled.value) return "text-gray-400";
    if (isHovered.value) return "text-blue-500";
    return "text-blue-400";
});

// 勾选标记颜色
const checkColorClass = computed(() => {
    return disabled.value ? "text-gray-400" : "text-blue-400";
});

// 不确定状态标记颜色
const indeterminateColorClass = computed(() => {
    return disabled.value ? "bg-gray-400" : "bg-blue-400";
});
</script>

<template>
    <label
        :class="[
            'inline-flex items-center gap-2 cursor-pointer select-none',
            disabled && 'cursor-not-allowed',
            props.className,
        ]">
        <div
            :class="[
                'relative size-4.5 rounded-[3px] border transition-all duration-150',
                'flex items-center justify-center',
                borderColorClass,
                backgroundColorClass,
            ]"
            :style="{
                transform: isPressed ? 'scale(0.92)' : 'scale(1)',
                transition: 'transform 100ms ease-out, background-color 150ms, border-color 150ms',
            }"
            @click="handleClick"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <!-- 勾选标记 -->
            <svg
                v-if="checked === true"
                :class="['w-3 h-3 transition-all duration-150', checkColorClass]"
                viewBox="0 0 12 12"
                fill="currentColor"
                :style="{
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                    transition: 'transform 100ms ease-out',
                }">
                <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
            </svg>

            <!-- 不确定状态标记 -->
            <div
                v-if="checked === null"
                :class="['w-2.5 h-2.5 rounded-xs', indeterminateColorClass]"
                :style="{
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                    transition: 'transform 100ms ease-out',
                }"
            />
        </div>

        <span v-if="props.Text" :class="['text-[13px] transition-colors duration-150', textColorClass]">
            {{ props.Text }}
        </span>
    </label>
</template>
