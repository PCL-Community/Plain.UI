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

export default {
    install(app) {
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
