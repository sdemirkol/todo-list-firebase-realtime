import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import FontAweSome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import instance from '../utils/instance'

const Home = ({ route }) => {
    const [state, setState] = useState({
        name: '',
        datas: []
    })
    const navigation = useNavigation();
    console.log('-----------route-----------')
    console.log(route)
    if (route.params !== undefined && route.params.control) {
        console.log('detail den geldi')
        let updatedData = state.datas;
        let item = updatedData.find(x => x.key == route.params.key)
        console.log(item);
        item.name = route.params.name;
        state.datas = updatedData;
        console.log(updatedData)
        //setState({ ...state });
        console.log('-----------state.datas---------');
        console.log(state.datas);
        route.params.control = false;
    } else {
        console.log('herhangi bir güncelleme yapılmadı')
    }

    //fetch or read the data from firestore
    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        state.datas = []
        instance.get('/posts.json')
            .then(function (response) {
                // handle success      
                console.log(response);
                for (let item in response.data) {
                    state.datas.push({ ...response.data[item], key: item })
                }
                console.log(state.datas)
                setState({ ...state });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    const postData = () => {
        instance.post('/posts.json', {
            name: state.name
        })
            .then(function (response) {
                console.log(response.config.data);
                const item = JSON.parse(response.config.data);
                console.log(item);
                console.log(response.data)
                state.datas.push({ ...item, key: response.data.name })
                console.log(state.datas)
                state.name = '';
                setState({ ...state });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const deleteData = (item) => {
        instance.delete(`/posts/${item.key}.json`)
            .then(function (response) {
                console.log(item);
                //console.log(state.datas);
                let arr = state.datas;
                let filteredData = arr.filter(x => x.key !== item.key)
                state.datas = filteredData;
                setState({ ...state });
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const itemView = ({ item, index }) => {
        return (
            <View>
                <Pressable
                    style={styles.container}
                    onPress={() => navigation.navigate('Detail', { item })}
                >
                    <FontAweSome
                        name='trash-o'
                        color='red'
                        onPress={() => deleteData(item)}
                        style={styles.todoIcon}
                    />
                    <View style={styles.innerContainer}>
                        <Text style={styles.itemHeading} >
                            {item.name}
                        </Text>
                    </View>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formContainer}>
                <TextInput
                    name=''
                    style={styles.input}
                    placeholder='Yeni bir iş gir'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(text) => setState({ ...state, name: text })}
                    value={state.name}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} //</View>onPress={addTodo}
                >
                    <Text
                        style={styles.buttonText}
                        onPress={postData}
                    >Ekle</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={state.datas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={itemView}
            />
        </View>

    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 45,
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 22,
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 100,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    todoIcon: {
        // marginTop: 5,
        fontSize: 26,
        marginLeft: 14

    }
})