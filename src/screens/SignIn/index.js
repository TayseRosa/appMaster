import React, { useState, useContext } from "react";
import {
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText,
    SignMessageButtonBold
} from './styles';

import Api from '../../Api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from '../../contexts/UserContext';

import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';

import SignInput from "../../components/SignInput";
import { useNavigation } from "@react-navigation/native";

export default () => {
    //dispatch
    const { dispatch:userDispatch } = useContext(UserContext);
    const navigation = useNavigation();

    const [ emailField, setEmailField ] = useState('suporte@b7web.com.br');
    const [ passwordField, setPasswordField ] = useState('1234');

    const handleSignClick = async () => {
        if(emailField !== '' && passwordField !== ''){

            let json = await Api.signIn(emailField, passwordField);
            if (json.token){
                //salva o token no async storage
                await AsyncStorage.setItem('token', json.token);

                //salva no context
                userDispatch({
                    type: 'setAvatar',
                    payload:{
                        avatar: json.data.avatar
                    }
                });

                navigation.reset({
                    routes: [{name: 'MainTab'}]
                })
            }else{
                alert('E-mail e/ou senha incorretos')
            }

        }else{
            alert('Preencha os campos')
        }
    }

    const handleMessageButtonClick =() => {
        navigation.reset({
            routes: [{name: 'SignUp'}]
        });
    }


    return(
        <Container>
            <BarberLogo width="100%" height="160" />
            

            <InputArea>
                
                <SignInput IconSvg={EmailIcon} placeholder="Digite seu e-mail" value={emailField} onChangeText={t=>setEmailField(t)} />
                <SignInput IconSvg={LockIcon} placeholder="Digite sua senha" value={passwordField} onChangeText={t=>setPasswordField(t)} password={true} />

                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText>LOGIN</CustomButtonText>
                </CustomButton>
            </InputArea>

            <SignMessageButton onPress={ handleMessageButtonClick }>
                <SignMessageButtonText>Ainda não possui uma conta?</SignMessageButtonText>
                <SignMessageButtonBold>Cadastre-se</SignMessageButtonBold>
            </SignMessageButton>

        </Container>
    )
}