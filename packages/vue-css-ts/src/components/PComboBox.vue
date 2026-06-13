<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

export interface PComboBoxItem {
    Value: string;
    Label: string;
}

export interface PComboBoxProps {
    /** 选项列表 */
    Items: PComboBoxItem[];
    /** 当前选中值 */
    Text?: string;
    /** 提示文本 */
    HintText?: string;
    /** 是否可编辑 */
    IsEditable?: boolean;
    /** 是否禁用 */
    IsEnabled?: boolean;
    /** 值变更事件 */
    onChange?: (value: string) => void;
    /** 文本变更事件 */
    onTextChange?: (text: string) => void;
    /** 自定义类名 */
    className?: string;
}

const props = withDefaults(defineProps<PComboBoxProps>(), {
    Items: () => [],
    Text: undefined,
    HintText: "",
    IsEditable: false,
    IsEnabled: true,
    className: "",
});

const emit = defineEmits<{
    change: [value: string];
    textChange: [text: string];
}>();

const disabled = computed(() => !props.IsEnabled);
const internalValue = ref("");
const isOpen = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const isPressed = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const value = computed(() => props.Text !== undefined ? props.Text : internalValue.value);
const selectedOption = computed(() => props.Items.find((opt) => opt.Value === value.value));
const displayText = computed(() => selectedOption.value?.Label || (props.IsEditable ? value.value : ""));

const handleSelect = (option: PComboBoxItem) => {
    if (props.Text === undefined) {
        internalValue.value = option.Value;
    }
    props.onChange?.(option.Value);
    emit("change", option.Value);
    isOpen.value = false;
};

const handleInputChange = (e: Event) => {
    const newText = (e.target as HTMLInputElement).value;
    if (props.Text === undefined) {
        internalValue.value = newText;
    }
    props.onTextChange?.(newText);
    emit("textChange", newText);
    props.onChange?.(newText);
    emit("change", newText);
};

const handleToggle = () => {
    if (!disabled.value) {
        isOpen.value = !isOpen.value;
    }
};

// 点击外部关闭下拉
const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});

// 颜色状态
const borderColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    if (isOpen.value || isPressed.value) return "#3b82f6"; // blue-500
    if (isHovered.value) return "#60a5fa"; // blue-400
    return "#93c5fd"; // blue-300
});

const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6"; // gray-100
    if (isOpen.value || isPressed.value) return "#eff6ff"; // blue-50
    if (isHovered.value) return "#eff6ff"; // blue-50
    return "rgba(255, 255, 255, 0.5)";
});

const textColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    return "#374151"; // gray-700
});

const arrowColor = computed(() => {
    if (disabled.value) return "#9ca3af"; // gray-400
    return "#60a5fa"; // blue-400
});
</script>

<template>
    <div ref="containerRef" class="p-combobox" :class="className">
        <!-- 输入框/触发器 -->
        <div
            class="p-combobox-trigger"
            :style="{
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }">
            <input
                v-if="IsEditable"
                ref="inputRef"
                type="text"
                :value="displayText"
                @input="handleInputChange"
                :placeholder="HintText"
                :disabled="disabled"
                class="p-combobox-input"
                :style="{ color: textColor }"
                @focus="isFocused = true"
                @blur="isFocused = false"
            />
            <div
                v-else
                class="p-combobox-display"
                :style="{ color: textColor }"
                @click="handleToggle">
                {{ displayText || HintText || "请选择..." }}
            </div>

            <!-- 下拉箭头 -->
            <button
                type="button"
                :disabled="disabled"
                class="p-combobox-arrow-btn"
                :class="{ disabled }"
                :style="{ color: arrowColor }"
                @click="handleToggle"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
                @mousedown="isPressed = true"
                @mouseup="isPressed = false">
                <svg
                    class="p-combobox-arrow"
                    :class="{ open: isOpen }"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>
        </div>

        <!-- 下拉选项列表 -->
        <div v-if="isOpen" class="p-combobox-dropdown">
            <div
                v-for="option in Items"
                :key="option.Value"
                class="p-combobox-option"
                :class="{ selected: option.Value === value }"
                @click="handleSelect(option)">
                {{ option.Label }}
            </div>
            <div v-if="Items.length === 0" class="p-combobox-empty">无选项</div>
        </div>
    </div>
</template>

<style scoped>
.p-combobox {
    position: relative;
}

.p-combobox-trigger {
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: 3px;
    transition: all 200ms;
}

.p-combobox-input {
    flex: 1;
    padding: 8px 12px;
    font-size: 13px;
    background: transparent;
    border: none;
    outline: none;
}

.p-combobox-input::placeholder {
    color: #9ca3af;
}

.p-combobox-display {
    flex: 1;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
}

.p-combobox-arrow-btn {
    padding: 8px 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 200ms;
}

.p-combobox-arrow-btn.disabled {
    cursor: not-allowed;
}

.p-combobox-arrow {
    width: 16px;
    height: 16px;
    transition: transform 200ms;
}

.p-combobox-arrow.open {
    transform: rotate(180deg);
}

.p-combobox-dropdown {
    position: absolute;
    z-index: 50;
    width: 100%;
    margin-top: 4px;
    padding: 4px 0;
    background-color: white;
    border: 1px solid #93c5fd;
    border-radius: 3px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    max-height: 240px;
    overflow: auto;
}

.p-combobox-option {
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: all 150ms;
    color: #374151;
}

.p-combobox-option:hover {
    background-color: #eff6ff;
    color: #60a5fa;
}

.p-combobox-option.selected {
    background-color: #dbeafe;
    color: #3b82f6;
}

.p-combobox-empty {
    padding: 8px 12px;
    font-size: 13px;
    color: #9ca3af;
}
</style>
