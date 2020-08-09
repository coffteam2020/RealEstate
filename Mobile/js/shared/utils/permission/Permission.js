import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
const Permission = {
    checkPermission (permission){
        return new Promise((res, rej) => {
            check(permission)
        })
    }
}

export default Permission;