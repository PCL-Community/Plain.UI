<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    /** 是否选中 */
    Checked: {
        type: [Boolean, null],
        default: undefined,
    },
    /** 是否为三态复选框 */
    IsThreeState: {
        type: Boolean,
        default: false,
    },
    /** 文本 */
    Text: String,
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["change", "previewChange"]);

const internalChecked = ref(false);
const isPressed = ref(false);
const isHovered = ref(false);

const disabled = computed(() => !props.IsEnabled);

const checked = computed(() =>
    props.Checked !== undefined ? props.Checked : internalChecked.value
);

const getNextState = (current) => {
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
    if (emit("previewChange", nextState) === false) return;

    if (props.Checked === undefined) {
        internalChecked.value = nextState;
    }
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
    if (disabled.value) return "#9ca3af";
    if (checked.value === true) return isHovered.value ? "#3b82f6" : "#60a5fa";
    return isHovered.value ? "#3b82f6" : "#60a5fa";
});

// 背景颜色
const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6";
    if (isPressed.value && checked.value === true) return "#dbeafe";
    return "rgba(255, 255, 255, 0.5)";
});

// 文本颜色
const textColor = computed(() => {
    if (disabled.value) return "#9ca3af";
    if (isHovered.value) return "#3b82f6";
    return "#60a5fa";
});

// 图标颜色
const iconColor = computed(() => {
    if (disabled.value) return "#9ca3af";
    return "#60a5fa";
});
</script>

<template>
    <label
        class="p-checkbox"
        :class="[className, { 'p-checkbox--disabled': disabled }]">
        <div
            class="p-checkbox__box"
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
                class="p-checkbox__check"
                :style="{
                    color: iconColor,
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                }"
                viewBox="0 0 12 12"
                fill="currentColor">
                <path d="M0,6L1.5,4.5 4.5,7.5 10.5,1.5 12,3 4.5,10.5 0,6z" />
            </svg>

            <!-- 不确定状态标记 -->
            <div
                v-if="checked === null"
                class="p-checkbox__indeterminate"
                :style="{
                    backgroundColor: iconColor,
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                }" />
        </div>

        <span
            v-if="Text"
            class="p-checkbox__text"
            :style="{ color: textColor }">
            {{ Text }}
        </span>
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

.p-checkbox--disabled {
    cursor: not-allowed;
}

.p-checkbox__box {
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

.p-checkbox__check {
    width: 12px;
    height: 12px;
    transition: transform 100ms ease-out;
}

.p-checkbox__indeterminate {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    transition: transform 100ms ease-out;
}

.p-checkbox__text {
    font-size: 13px;
    transition: color 150ms;
}
</style>
