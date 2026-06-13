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
const checked = computed(() => props.Checked !== undefined ? props.Checked : internalChecked.value);

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
const borderColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    if (checked.value === true) return isHovered.value ? "#3b82f6" : "#60a5fa"; // blue-500 : blue-400
    return isHovered.value ? "#3b82f6" : "#60a5fa";
});

// 背景颜色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6"; // gray-100
    if (isPressed.value && checked.value === true) return "#dbeafe"; // blue-100
    return "rgba(255, 255, 255, 0.5)";
});

// 文本颜色
const textColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    if (isHovered.value) return "#3b82f6"; // blue-500
    return "#60a5fa"; // blue-400
});

// 勾选标记颜色
const checkColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    return "#60a5fa"; // blue-400
});

// 不确定状态标记颜色
const indeterminateColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    return "#60a5fa"; // blue-400
});
</script>

<template>
    <label class="p-checkbox" :class="[className, { disabled }]">
        <div
            class="p-checkbox-box"
            :style="{
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                transform: isPressed ? 'scale(0.92)' : 'scale(1)',
            }"
            @click="handleClick"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <!-- 勾选标记 -->
            <svg
                v-if="checked === true"
                class="p-checkbox-check"
                :style="{
                    color: checkColor,
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                }"
                viewBox="0 0 12 12"
                fill="currentColor">
                <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
            </svg>

            <!-- 不确定状态标记 -->
            <div
                v-if="checked === null"
                class="p-checkbox-indeterminate"
                :style="{
                    backgroundColor: indeterminateColor,
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                }"
            />
        </div>

        <span v-if="Text" class="p-checkbox-text" :style="{ color: textColor }">{{ Text }}</span>
    </label>
</template>

<style scoped>
.p-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.p-checkbox.disabled {
    cursor: not-allowed;
}

.p-checkbox-box {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 100ms ease-out, background-color 150ms, border-color 150ms;
}

.p-checkbox-check {
    width: 12px;
    height: 12px;
    transition: transform 100ms ease-out;
}

.p-checkbox-indeterminate {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    transition: transform 100ms ease-out;
}

.p-checkbox-text {
    font-size: 13px;
    transition: color 150ms;
}
</style>
