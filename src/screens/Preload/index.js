import React, { useContext, useEffect } from "react";
import {
    Container,
    LoadingIcon
} from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Api from '../../Api';

import BarberLogo from '../../assets/barber.svg';
import * as Svg from 'react-native-svg';


import { Text } from 'react-native';
import {UserContext} from "../../contexts/UserContext";

export default () => {
    const { dispatch: userDispatch } = useContext(UserContext)
    const navigation = useNavigation();

    useEffect(()=>{
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if(token){
                //validar token
                let res = await Api.checkToken(token);
                if(res.token){
                    //salva no async
                    await AsyncStorage.setItem('token', res.token);

                    //salva o avatar no context
                    userDispatch({
                        type: 'setAvatar',
                        payload:{
                            avatar: res.data.avatar
                        }
                    });

                    //manda pro mainTab
                    navigation.reset({
                        routes:[{name:'MainTab'}]
                    })

                }else{
                    navigation.navigate('SignIn')
                }
            }else{
                navigation.navigate('SignIn');
            }
        }
        checkToken();
    },[]);

    return(
        <Container>
            <BarberLogo width="100%" height="160" />
            <LoadingIcon size="large" color="#FFFFFF" />
        </Container>
    )
}