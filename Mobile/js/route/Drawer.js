import React from "react";
import { View, TouchableOpacity, ImageBackground } from "react-native";
import IAHeader from "../shared/components/IAHeader";
import Ionicon from "react-native-vector-icons/Ionicons";
import icons from "../shared/utils/icons/icons";
import styles from "./styles";
import { colors } from "../shared/utils/colors/colors";
import { images } from "../../assets";
import I18n from "../shared/utils/locale/i18n";
import { ScreenNames } from "./ScreenNames";
import IAText from "../shared/components/IAText";
import { DrawerActions } from "react-navigation";
import IALocalStorage from "../shared/utils/storage/IALocalStorage";

const langs = {
	home: I18n.t("drawer.home").toUpperCase(),
	leagues: I18n.t("drawer.leagues").toUpperCase(),
	leaguesCreation: I18n.t("drawer.leaguesCreation").toUpperCase(),
	results: I18n.t("drawer.results").toUpperCase(),
	notification: I18n.t("drawer.notification").toUpperCase(),
	settings: I18n.t("drawer.settings").toUpperCase(),
	logout: I18n.t("drawer.logout").toUpperCase(),
};
const listItems = [
	{ id: 0, title: langs.home, route: ScreenNames.HomeScreen },
	{ id: 1, title: langs.leagues, route: "" },
	{ id: 2, title: langs.leaguesCreation, route: "" },
	{ id: 3, title: langs.results, route: "" },
	{ id: 4, title: langs.notification, route: "" },
	{ id: 5, title: langs.settings, route: "" },
	{ id: 6, title: langs.logout, route: "" },
];

class Drawer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentIdItem: 0,
		};
	}
	_renderDrawerIco() {
		return (
			<TouchableOpacity onPress={() => { this._closeDrawer(); }}>
				<Ionicon name={"ios-close"} size={50} color={colors.black} style={styles.drawer} />
			</TouchableOpacity>
		);
	}

	_closeDrawer() {
		this.props.navigation.dispatch(DrawerActions.closeDrawer());
	}

	resetToWelcomeNavigator() {
		this.props.navigation.navigate(ScreenNames.WelcomeScreen);
	}

	resetAllToken() {
		IALocalStorage.resetLocalStorage();
	}

	_onLogOutPressed = () => {
		this.resetToWelcomeNavigator();
		this.resetAllToken();
	}

	_doAction = (item) => {
		this._closeDrawer();
		if (item.id !== 6) {
			this.props.navigation.navigate(item.route);
			this.setState({
				currentIdItem: item.id
			});
		} else {
			this._onLogOutPressed();
		}
	}

	_renderBadge() {
		return (
			<View style={styles.badge} />
		);
	}

	_renderNotificationsIco() {
		return (
			<TouchableOpacity style={{ marginTop: 15 }}>
				<View>
					{icons.notification.IC_NOTIFICATION}
					{this._renderBadge()}
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<View>
				<IAHeader
					viewLeft={this._renderDrawerIco()}
					onPressLeft={() => { this._closeDrawer(); }}
					viewRight={this._renderNotificationsIco()}
					onPressRight={() => { }}
					viewCenter={null}
				/>
				<ImageBackground source={images.drawer_bg}
					style={styles.imgBackground} resizeMode={"stretch"}>
					<View style={styles.imgBackgroundContent}>
						{listItems.map(item => {
							return (
								<TouchableOpacity key={item.title} onPress={() => {
									this._doAction(item);
								}}>
									<View style={{ marginBottom: 37 }}>
										<IAText text={item.title} style={styles.drawerItem} shouldUnderline={this.state.currentIdItem === item.id} />
									</View>
								</TouchableOpacity>
							);
						})}
					</View>
				</ImageBackground>

			</View>
		);
	}
}
export default Drawer;