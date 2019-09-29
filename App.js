import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native'

import AsyncStorage from "@react-native-community/async-storage"

import ImagePicker from 'react-native-image-picker';

const retrieveData = async str => {
  try {
    const value = await AsyncStorage.getItem(str)
    if (value !== null) {
      return value
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {

  }
}

export default class App extends Component {
  state = {
    counter: 0,
    text: '',
    input: '',
    photo: null,
  }

  componentDidMount = () => {
    this.setInitialState()
  }

  setInitialState = async () => {
    const initialState = await retrieveData('App')
    if (initialState) {
      const parsedState = await JSON.parse(initialState)
      this.setState(parsedState)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state !== prevState) {
      const stringifiedState = JSON.stringify(this.state)
      storeData('App', stringifiedState)
    }
  }

  increment = () => {
    this.setState({ counter: this.state.counter + 1 })
  }

  showPicker = () => {
    // import ImagePicker from 'react-native-image-picker';

    let options = {
      title: '画像を選択',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    ImagePicker.showImagePicker(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response.uri)
        this.setState({photo: response.uri})
      }
    });
  }

  

  render () {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 50}}>{this.state.input}</Text>
        {this.state.photo && <Image style={{width: 300, height: 300}} source={{uri: this.state.photo}} />}
        <Text onPress={() => this.increment()}>PERSIST</Text>
        <Text>{this.state.counter}</Text>
        <TextInput
                placeholder="write here..." 
                value={this.state.text}
                onChangeText={(text) => this.setState({text: text})}
            />
        <Button
                 title="TextInput"
                 // onPress={()=> this.props.onAddToDo(this.state.inputText)}
                // onPress={() => this.setState({text: ""})}
                 onPress={this.doAction}
            />
        <Button
              title="ImagePicker"
              onPress={this.showPicker} 
            />
      </View>
    );
  }
  doAction = () => {
    this.setState({text: '', input: this.state.text})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})