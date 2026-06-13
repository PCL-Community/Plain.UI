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
    IsEnabled: true,
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

const value = computed(() => (props.Text !== undefined ? props.Text : internalValue.value));
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
const borderColorClass = computed(() => {
    if (!props.IsEnabled) return "border-gray-400";
    if (hasError.value) return "border-red-400";
    if (isFocused.value) return "border-blue-500";
    if (isHovered.value) return "border-blue-400";
    return "border-blue-300";
});

// 背景颜色
const backgroundColorClass = computed(() => {
    if (!props.HasBackground) return "bg-transparent";
    if (!props.IsEnabled) return "bg-gray-100";
    if (hasError.value) return "bg-red-50";
    if (isFocused.value) return "bg-blue-50";
    if (isHovered.value) return "bg-blue-50";
    return "bg-white/50";
});

// 文本颜色
const textColorClass = computed(() => {
    if (!props.IsEnabled) return "text-gray-400";
    if (hasError.value) return "text-red-500";
    return "text-gray-700";
});
</script>

<template>
    <div :class="['flex flex-col gap-1', props.className]">
        <div
            :class="[
                'relative flex items-center border transition-all duration-200',
                borderColorClass,
                backgroundColorClass,
            ]"
            :style="{ borderRadius: `${props.CornerRadius}px` }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <input
                ref="inputRef"
                :type="props.Type"
                :value="value"
                @input="handleChange"
                @keydown="handleKeyDown"
                @focus="handleFocus"
                @blur="handleBlur"
                :disabled="!props.IsEnabled"
                :placeholder="props.Placeholder"
                :class="[
                    'w-full px-3 py-2 text-[13px] bg-transparent outline-none',
                    textColorClass,
                    'placeholder:text-gray-400',
                ]"
            />

            <!-- 提示文本 -->
            <span
                v-if="props.HintText && !value && !props.Placeholder"
                class="absolute left-3 text-[13px] text-gray-400 pointer-events-none">
                {{ props.HintText }}
            </span>
        </div>

        <!-- 验证错误信息 -->
        <div
            v-if="hasError && props.ShowValidateResult"
            class="text-[12px] text-red-500 animate-fadeIn">
            {{ props.ValidateResult }}
        </div>
    </div>
</template>
