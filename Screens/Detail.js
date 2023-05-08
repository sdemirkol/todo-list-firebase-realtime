import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import instance from '../utils/instance';

const Detail = ({ route }) => {
    const [state, setState] = useState({
        key: route.params.item.key,
        name: route.params.item.name,
        control:false
    })
    console.log(state.name);
    console.log(state.key);
    // const todoRef = firebase.firestore().collection('todos');
    const [textHeading, onChangeHeadingText] = useState(route.params.item.name);
    const navigation = useNavigation();

    const updateData = () => {
        console.log(state.name);
        if (state.name && state.name.length > 0) {
            instance.put(`/posts/${state.key}`+'.json', {
                name: state.name
            })
                .then(function (response) {
                    console.log(response);
                    state.control=true;
                    navigation.navigate('Home',state)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }

    return (
        <View style={styles.container} >
            <TextInput
                style={styles.textField}
                onChangeText={(text) => setState({ ...state, name: text })}
                value={state.name}
                placeHolder='Güncelle'
            />
            <Pressable
                style={styles.buttonUpdate}
                onPress={() => { updateData() }}
            >
                <Text>İşi Güncelle</Text>
            </Pressable>

        </View>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginLeft: 15,
        marginRight: 15,
    },
    textField: {
        marginBottom: 10,
        padding: 10,
        fontSize: 15,
        color: '#000000',
        backgroundColor: '#e0e0e0',
        borderRadius: 5
    },
    buttonUpdate: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 10,
        backgroundColor: '#0de065',
    }
})