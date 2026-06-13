import type { App } from "vue";

// 导入所有组件
import PButton from "./components/PButton.vue";
import PTextBox from "./components/PTextBox.vue";
import PCheckBox from "./components/PCheckBox.vue";
import PSlider from "./components/PSlider.vue";
import PRadioButton from "./components/PRadioButton.vue";
import PIconButton from "./components/PIconButton.vue";
import PCard from "./components/PCard.vue";
import PComboBox from "./components/PComboBox.vue";
import PExtraButton from "./components/PExtraButton.vue";
import PExtraTextButton from "./components/PExtraTextButton.vue";
import PHint from "./components/PHint.vue";
import PIconTextButton from "./components/PIconTextButton.vue";
import PListItem from "./components/PListItem.vue";
import PLoading from "./components/PLoading.vue";
import PSearchBox from "./components/PSearchBox.vue";

// 导出组件
export {
    PButton,
    PTextBox,
    PCheckBox,
    PSlider,
    PRadioButton,
    PIconButton,
    PCard,
    PComboBox,
    PExtraButton,
    PExtraTextButton,
    PHint,
    PIconTextButton,
    PListItem,
    PLoading,
    PSearchBox,
};

// 导出类型
export type { PButtonColorState } from "./components/PButton.vue";
export type { PTextBoxProps } from "./components/PTextBox.vue";
export type { PCheckBoxProps } from "./components/PCheckBox.vue";
export type { PSliderProps } from "./components/PSlider.vue";
export type { PRadioButtonProps } from "./components/PRadioButton.vue";
export type { PIconButtonProps } from "./components/PIconButton.vue";
export type { PCardProps } from "./components/PCard.vue";
export type { PComboBoxProps, PComboBoxItem } from "./components/PComboBox.vue";
export type { PExtraButtonProps } from "./components/PExtraButton.vue";
export type { PExtraTextButtonProps } from "./components/PExtraTextButton.vue";
export type { PHintProps, PHintTheme } from "./components/PHint.vue";
export type { PIconTextButtonProps } from "./components/PIconTextButton.vue";
export type { PListItemProps } from "./components/PListItem.vue";
export type { PLoadingProps, PLoadingState } from "./components/PLoading.vue";
export type { PSearchBoxProps } from "./components/PSearchBox.vue";

// 默认导出（Vue 插件）
export default {
    install(app: App) {
        app.component("PButton", PButton);
        app.component("PTextBox", PTextBox);
        app.component("PCheckBox", PCheckBox);
        app.component("PSlider", PSlider);
        app.component("PRadioButton", PRadioButton);
        app.component("PIconButton", PIconButton);
        app.component("PCard", PCard);
        app.component("PComboBox", PComboBox);
        app.component("PExtraButton", PExtraButton);
        app.component("PExtraTextButton", PExtraTextButton);
        app.component("PHint", PHint);
        app.component("PIconTextButton", PIconTextButton);
        app.component("PListItem", PListItem);
        app.component("PLoading", PLoading);
        app.component("PSearchBox", PSearchBox);
    },
};
