import { observable, action, computed } from 'mobx';
import { CustomDarkTheme, CustomLightTheme } from "../themes/index";
import { initialMode } from 'react-native-dark-mode'
import { Appearance } from "react-native-appearance";
const colorScheme = Appearance.getColorScheme();
const isDark = colorScheme === "dark";

export class HomeStore {
    @observable darkMode = isDark
    @observable theme = CustomLightTheme

    @observable imageHasToShown = null;
    @observable shouldShowImageZoom = false;

    @action.bound
    setChangeTheme(theme) {
        this.darkMode = theme === CustomDarkTheme;
        this.theme = theme;
    }
    @action.bound
    setChangeDarkMode(isDarkMode) {
        console.log(isDarkMode);
        this.darkMode = isDarkMode;
        console.log(this.darkMode);
        this.theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;
    }

    @computed
    get getTheme() {
        return this.darkMode
    }


    @action.bound
    setImageUri(uri) {
        this.imageHasToShown = uri;
    }
    @action.bound
    setShowImageZoom(shouldShow, uri) {
        this.shouldShowImageZoom = shouldShow;
        if (uri) {
            console.log(uri);
            this.imageHasToShown = uri;
        }
    }
}
