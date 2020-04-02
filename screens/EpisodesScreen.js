import * as React from 'react';
import { Image, Platform, StyleSheet , TouchableOpacity, View, AsyncStorage, ImageBackground, Alert, FlatList, AppRegistry, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {Input,Button,Text, Icon, Container, Item, Label, Grid, Col, Card, CardItem, Row, Spinner, ActionSheet, Root,} from 'native-base';
import { Header, Left, Title, Body, Right, Content, Footer, FooterTab} from 'native-base';
import Video from 'react-native-video';

export default class EpisodesScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			items: this.props.data?this.props.data:[],
		}
		
	}

  render() {

    return (
		<ScrollView>
			<FlatList
				data={this.state.items}
				renderItem={({item,index}) => <Episode chngScreen={this.props.chngScreen} item={item} />}
				numColumns={2}
			/>
		</ScrollView>
    );
  }
}

class Episode extends React.Component {
	state = {
		process: false
	}
	episode = async () => {
		this.setState({process:true});
		var e = this.props.item;
		// IFRAME LINK
		// <iframe src="\/\/vidstreaming\.io\/streaming\.php\?(.*?)"
		const iframe = /<iframe src="\/\/vidstreaming\.io\/streaming\.php\?(.*?)"/gm;
		
		// VIDEO URL
		// <div class="dowload"><a[\n ]* href="(.*)" download>
		var rawweb = await (await fetch("https://www2.gogoanime.video/"+e.url)).text();
		let m,id;
		while ((m = iframe.exec(rawweb)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === iframe.lastIndex) {
				iframe.lastIndex++;
			}
			id = m[1];
		}
		const vdoreg = /<div class="dowload"><a[\n ]* href="(.*)" download>/gm;
		var rawvdo = await (await fetch("https://vidstreaming.io/download?"+id)).text();
		let videolinks = [];
		while ((m = vdoreg.exec(rawvdo)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === vdoreg.lastIndex) {
				vdoreg.lastIndex++;
			}
			videolinks.push(m[1]);
		}
		console.log(videolinks);
		let qualitis = [];
		await videolinks.map((element,index) => {
			qualitis.push({url:element,text:"Link "+(index+1)})
		});
		var ci = qualitis.push({url:"",text:"Cancel"})-1

		ActionSheet.show(
			{
				options:qualitis,
				cancelButtonIndex:ci,
				title:"Select Quality"
			},
			buttonIndex => {
				if(qualitis[buttonIndex].text!="Cancel"){
					var url =qualitis[buttonIndex].url;
					url = url.replace(/&amp;/g, '&') 
					Linking.openURL(url)
					// alert("clicked "+qualitis[buttonIndex].text)
					// this.props.chngScreen(4,qualitis[buttonIndex])
				}
			}
		)
		this.setState({process:false});
	}
	render() {
		var item = this.props.item;
		return(
			<Root>
			<Card transparent style={{flex:1,alignContent:"center",paddingHorizontal:10}} >
				<Button style={{flex:1,alignContent:"center",alignItems:"center",alignSelf:"center"}} onPress={() => {this.episode(item.url)}}>
					<Text>
						Episode {item.ep}
						{
							this.state.process?
								<Spinner style={{width:10,height:10,paddingHorizontal:10}} size="small" />:null
						}
					</Text>
				</Button>
			</Card>			

			</Root>
		)
	}
}
