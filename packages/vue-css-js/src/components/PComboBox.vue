<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
    /** 选项列表 */
    Items: {
        type: Array,
        required: true,
    },
    /** 当前选中值 */
    Text: String,
    /** 提示文本 */
    HintText: {
        type: String,
        default: "",
    },
    /** 是否可编辑 */
    IsEditable: {
        type: Boolean,
        default: false,
    },
    /** 是否禁用 */
    IsEnabled: {
        type: Boolean,
        default: true,
    },
    /** 自定义类名 */
    className: String,
});

const emit = defineEmits(["change", "textChange"]);

const internalValue = ref("");
const isOpen = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const isPressed = ref(false);
const containerRef = ref(null);
const inputRef = ref(null);

const disabled = computed(() => !props.IsEnabled);

const value = computed(() =>
    props.Text !== undefined ? props.Text : internalValue.value
);

const selectedOption = computed(() =>
    props.Items.find((opt) => opt.Value === value.value)
);

const displayText = computed(
    () => selectedOption.value?.Label || (props.IsEditable ? value.value : "")
);

const handleSelect = (option) => {
    if (props.Text === undefined) {
        internalValue.value = option.Value;
    }
    emit("change", option.Value);
    isOpen.value = false;
};

const handleInputChange = (e) => {
    const newText = e.target.value;
    if (props.Text === undefined) {
        internalValue.value = newText;
    }
    emit("textChange", newText);
    emit("change", newText);
};

const handleToggle = () => {
    if (!disabled.value) {
        isOpen.value = !isOpen.value;
    }
};

// 点击外部关闭下拉
const handleClickOutside = (e) => {
    if (containerRef.value && !containerRef.value.contains(e.target)) {
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
    if (disabled.value) return "#9ca3af";
    if (isOpen.value || isPressed.value) return "#3b82f6";
    if (isHovered.value) return "#60a5fa";
    return "#93c5fd";
});

const backgroundColor = computed(() => {
    if (disabled.value) return "#f3f4f6";
    if (isOpen.value || isPressed.value) return "#eff6ff";
    if (isHovered.value) return "#eff6ff";
    return "rgba(255, 255, 255, 0.5)";
});

const textColor = computed(() => {
    if (disabled.value) return "#9ca3af";
    return "#374151";
});
</script>

<template>
    <div ref="containerRef" class="p-combobox" :class="className">
        <!-- 输入框/触发器 -->
        <div
            class="p-combobox__input-wrapper"
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
                class="p-combobox__input"
                :style="{ color: textColor }"
                @focus="isFocused = true"
                @blur="isFocused = false" />
            <div
                v-else
                class="p-combobox__display"
                :style="{ color: textColor }"
                @click="handleToggle">
                {{ displayText || HintText || "请选择..." }}
            </div>

            <!-- 下拉箭头 -->
            <button
                type="button"
                :disabled="disabled"
                class="p-combobox__arrow"
                :class="{ 'p-combobox__arrow--open': isOpen }"
                @click="handleToggle"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
                @mousedown="isPressed = true"
                @mouseup="isPressed = false">
                <svg
                    class="p-combobox__arrow-icon"
                    :class="{ 'p-combobox__arrow-icon--open': isOpen }"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>
        </div>

        <!-- 下拉选项列表 -->
        <div v-if="isOpen" class="p-combobox__dropdown">
            <div
                v-for="option in Items"
                :key="option.Value"
                class="p-combobox__option"
                :class="{
                    'p-combobox__option--selected': option.Value === value,
                }"
                @click="handleSelect(option)">
                {{ option.Label }}
            </div>
            <div v-if="Items.length === 0" class="p-combobox__empty">
                无选项
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-combobox {
    position: relative;
}

.p-combobox__input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: 3px;
    transition: all 200ms;
}

.p-combobox__input,
.p-combobox__display {
    flex: 1;
    padding: 8px 12px;
    font-size: 13px;
    background: transparent;
    border: none;
    outline: none;
}

.p-combobox__display {
    cursor: pointer;
    user-select: none;
}

.p-combobox__input::placeholder {
    color: #9ca3af;
}

.p-combobox__arrow {
    padding: 8px 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 200ms;
    color: #60a5fa;
}

.p-combobox__arrow:hover:not(:disabled) {
    color: #3b82f6;
}

.p-combobox__arrow:disabled {
    color: #9ca3af;
    cursor: not-allowed;
}

.p-combobox__arrow-icon {
    width: 16px;
    height: 16px;
    transition: transform 200ms;
}

.p-combobox__arrow-icon--open {
    transform: rotate(180deg);
}

.p-combobox__dropdown {
    position: absolute;
    z-index: 50;
    width: 100%;
    margin-top: 4px;
    padding: 4px 0;
    background-color: white;
    border: 1px solid #93c5fd;
    border-radius: 3px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    max-height: 240px;
    overflow: auto;
}

.p-combobox__option {
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: all 150ms;
    color: #374151;
}

.p-combobox__option:hover {
    background-color: #eff6ff;
    color: #60a5fa;
}

.p-combobox__option--selected {
    background-color: #dbeafe;
    color: #3b82f6;
}

.p-combobox__empty {
    padding: 8px 12px;
    font-size: 13px;
    color: #9ca3af;
}
</style>
