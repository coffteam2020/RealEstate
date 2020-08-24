import {observable, action} from 'mobx';
import {TimeHelper} from '../shared/utils/helper/timeHelper';
import LogManager from '../shared/utils/logging/LogManager';

export class UserStore {
  // Authentication
  @observable userLoginInfo = {
    email: '',
    password: '',
  };
  @observable userInfo = undefined;
  @observable userKey = undefined;
  @observable userId = undefined;
  @observable userRegisterBeing = {};
  @observable messages = [];
  @observable follows = []
  @observable users = []
}
