<script setup lang="ts">
import { ref, computed } from "vue";

export interface PTextBoxProps {
    /** 输入值 */
    Text?: string;
    /** 提示文本 */
    HintText?: string;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 圆角 */
    CornerRadius?: number;
    /** 是否有背景 */
    HasBackground?: boolean;
    /** 是否显示验证结果 */
    ShowValidateResult?: boolean;
    /** 验证错误信息 */
    ValidateResult?: string;
    /** 输入变更事件 */
    onChange?: (value: string) => void;
    /** 回车事件 */
    onPressEnter?: () => void;
    /** 失去焦点事件 */
    onBlur?: () => void;
    /** 自定义类名 */
    className?: string;
    /** 占位符 */
    Placeholder?: string;
    /** 输入类型 */
    Type?: "text" | "password" | "number";
}

const props = withDefaults(defineProps<PTextBoxProps>(), {
    Text: undefined,
    HintText: "",
    IsEnabled: false,
    CornerRadius: 3,
    HasBackground: true,
    ShowValidateResult: true,
    ValidateResult: "",
    className: "",
    Placeholder: "",
    Type: "text",
});

const emit = defineEmits<{
    change: [value: string];
    pressEnter: [];
    blur: [];
}>();

const internalValue = ref("");
const isFocused = ref(false);
const isHovered = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const value = computed(() => props.Text !== undefined ? props.Text : internalValue.value);
const isValidated = computed(() => !props.ValidateResult || props.ValidateResult === "");
const hasError = computed(() => !isValidated.value && props.ShowValidateResult && value.value !== "");

const handleChange = (e: Event) => {
    const newValue = (e.target as HTMLInputElement).value;
    if (props.Text === undefined) {
        internalValue.value = newValue;
    }
    props.onChange?.(newValue);
    emit("change", newValue);
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        props.onPressEnter?.();
        emit("pressEnter");
    }
};

const handleFocus = () => {
    isFocused.value = true;
};

const handleBlur = () => {
    isFocused.value = false;
    props.onBlur?.();
    emit("blur");
};

const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
};

// 边框颜色
const borderColor = computed(() => {
    if (props.IsEnabled) return "#9ca3af"; // gray-400
    if (hasError.value) return "#f87171"; // red-400
    if (isFocused.value) return "#3b82f6"; // blue-500
    if (isHovered.value) return "#60a5fa"; // blue-400
    return "#93c5fd"; // blue-300
});

// 背景颜色
const backgroundColor = computed(() => {
    if (!props.HasBackground) return "transparent";
    if (props.IsEnabled) return "#f3f4f6"; // gray-100
    if (hasError.value) return "#fef2f2"; // red-50
    if (isFocused.value) return "#eff6ff"; // blue-50
    if (isHovered.value) return "#eff6ff"; // blue-50
    return "rgba(255, 255, 255, 0.5)";
});

// 文本颜色
const textColor = computed(() => {
    if (!props.IsEnabled) return "#9ca3af"; // gray-400
    if (hasError.value) return "#ef4444"; // red-500
    return "#374151"; // gray-700
});
</script>

<template>
    <div class="p-textbox-container" :class="className">
        <div
            class="p-textbox-wrapper"
            :style="{
                borderRadius: `${CornerRadius}px`,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <input
                ref="inputRef"
                :type="Type"
                :value="value"
                @input="handleChange"
                @keydown="handleKeyDown"
                @focus="handleFocus"
                @blur="handleBlur"
                :disabled="!IsEnabled"
                :placeholder="Placeholder"
                class="p-textbox-input"
                :style="{ color: textColor }"
            />

            <!-- 提示文本 -->
            <span v-if="HintText && !value && !Placeholder" class="p-textbox-hint">
                {{ HintText }}
            </span>
        </div>

        <!-- 验证错误信息 -->
        <div v-if="hasError && ShowValidateResult" class="p-textbox-error">
            {{ ValidateResult }}
        </div>
    </div>
</template>

<style scoped>
.p-textbox-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.p-textbox-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid;
    transition: all 200ms;
}

.p-textbox-input {
    width: 100%;
    padding: 8px 12px;
    font-size: 13px;
    background: transparent;
    border: none;
    outline: none;
}

.p-textbox-input::placeholder {
    color: #9ca3af;
}

.p-textbox-hint {
    position: absolute;
    left: 12px;
    font-size: 13px;
    color: #9ca3af;
    pointer-events: none;
}

.p-textbox-error {
    font-size: 12px;
    color: #ef4444;
    animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
