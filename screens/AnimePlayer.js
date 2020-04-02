import * as React from 'react';
import { Image, Platform, StyleSheet , TouchableOpacity, View, AsyncStorage, ImageBackground, Alert, FlatList, AppRegistry, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {Input,Button,Text, Icon, Container, Item, Label, Grid, Col, Card, CardItem, Row,} from 'native-base';
import { Header, Left, Title, Body, Right, Content, Footer, FooterTab} from 'native-base';
import Video from 'react-native-video';
var styles = StyleSheet.create({
	backgroundVideo: {
	  position: 'absolute',
	  top: 0,
	  left: 0,
	  bottom: 0,
	  right: 0,
	},
});
export default class AnimePlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			items: this.props.data?this.props.data:[],
		}
		
	}

	render() {
		
		var url =this.props.data.url.replace(/&amp;/g, '&') 
		return (
			<View style={{flex:1,backgroundColor:"#000"}}>
				<Video source={{uri: url}}   // Can be a URL or a local file.
					ref={(ref) => {
						this.player = ref
					}}
					fullscreenAutorotate
					controls
					onBuffer={(e) => {alert("buffer")}}
					onError={(e)=> {alert("error")}}
					style={styles.backgroundVideo}
				/>
			</View>
		);
	}
}
var styles = StyleSheet.create({
	backgroundVideo: {
	  position: 'relative',
	  height:200,
	  width:"100%",
	  top: 0,
	  left: 0,
	  bottom: 0,
	  right: 0,
	  zIndex:1000
	},
});