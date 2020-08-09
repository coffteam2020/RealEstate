import {images} from "../../../assets";
import I18n from "../../shared/utils/locale/i18n";

const langs = {
	airBaloonMotto: I18n.t("introductionScreen.airBaloonMotto"),
	boatMotto: I18n.t("introductionScreen.boatMotto"),
	egyptMotto: I18n.t("introductionScreen.egyptMotto"),
	moutainMotto: I18n.t("introductionScreen.moutainMotto"),
	planeMotto: I18n.t("introductionScreen.planeMotto"),
};

export const dataWithIcon = [
	{label: "Inbox", icon: "inbox", key: 0},
	{label: "Starred", icon: "star", key: 1},
	{label: "Sent mail", icon: "send", key: 2},
	{label: "Colored label", icon: "color-lens", key: 3},
	{label: "A very long title that will be truncated", icon: "delete", key: 4}
];

export const onBoardingData = [
	{
		description: langs.airBaloonMotto,
		backgroundColor: "rgba(2,100,188,.8)",
		gradients: ["rgba(28, 162, 98, .8)", "rgba(66, 184, 146, .8)"],
		img: images.introduction.airbaloon,
		imageFull: "https://unsplash.it/1200/1200?image=674",
		imageBlur: "https://unsplash.it/1200/1200?image=674&blur",
		icon: "star-face",
		color: "rgba(37, 1, 13, 1)"
	},
	{
		description: langs.boatMotto,
		backgroundColor: "rgba(97,180,9,.8)",
		gradients: ["rgba(14, 84, 194, 1)", "rgba(209, 67, 141, .8)"],
		img: images.introduction.boat,
		imageFull: "https://unsplash.it/1200/1200?image=668",
		imageBlur: "https://unsplash.it/1200/1200?image=668&blur",
		icon: "diamond",
		color: "rgba(36, 1, 13, 1)"
	},
	{
		description: langs.egyptMotto,
		backgroundColor: "rgba(83,103,153, .8)",
		gradients: ["rgba(60, 206, 207, .8)", "rgba(51, 19, 104, .8)"],
		img: images.introduction.egypt,
		imageFull: "https://unsplash.it/1200/1200?image=504",
		imageBlur: "https://unsplash.it/1200/1200?image=1083&blur",
		icon: "settings",
		color: "rgba(35, 1, 13, 1)"
	},

	{
		description: langs.moutainMotto,
		backgroundColor: "rgba(167,167,167, .9)",
		gradients: ["rgba(33, 204, 172, .8)", "rgba(143, 218, 213, .8)"],
		img: images.introduction.mount,
		imageFull: "https://unsplash.it/1200/1200?image=532",
		imageBlur: "https://unsplash.it/1200/1200?image=532&blur",
		icon: "star",
		color: "rgba(34, 1, 13, 1)"
	},
	{
		description: langs.planeMotto,
		backgroundColor: "rgba(18,113,134,.9)",
		gradients: ["rgba(20, 124, 220, .8)", "rgba(39, 234, 189, .8)"],
		img: images.introduction.plane,
		imageFull: "https://unsplash.it/1200/1200?image=529",
		imageBlur: "https://unsplash.it/1200/1200?image=529&blur",
		icon: "music-note-eighth",
		color: "rgba(33, 1, 13, 1)"
	}
];
