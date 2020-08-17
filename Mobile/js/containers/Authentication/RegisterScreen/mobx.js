import {observable, action} from 'mobx';

export class LoginStore {
  @observable theme = 'light';
  @action changeThem() {
      this.theme = 'dark'
	}
}
