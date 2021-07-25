import axios from 'axios';
import {API_URL} from '../components/Utils/XadrogaConstants';


// Sends a post request when a user signs in using google
class GoogleAuthService {


    signIn(idToken) {
        return axios.post(API_URL + 'signin/google', {
            idToken
        }).then(res => {
                if (res.data.success){
                    localStorage.setItem('user', JSON.stringify(res.data));
                }
                return res.data;
            });
    }
}

export default new GoogleAuthService();
