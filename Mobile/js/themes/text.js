import {FONTSIZES} from '.';
import fonts from '../shared/utils/fonts/fonts';
import {colors} from '../shared/utils/colors/colors';

export const textStyleDefault = {
	fontSize: FONTSIZES.avg,
	fontFamily: fonts.family.nunito.bold,
	color: colors.defaultGreen
};
export const textStyleDefaultWhite = {
	fontSize: FONTSIZES.default,
	fontFamily: fonts.family.nunito.bold,
	color: colors.whiteTransparent
};
export const textStyleDefaultHeader = {
	fontSize: FONTSIZES.xxLarge,
	fontFamily: fonts.family.nunito.bold,
};
export const textStyleDefaultRegular = {
	fontSize: FONTSIZES.default,
	fontFamily: fonts.family.nunito.regular,
};