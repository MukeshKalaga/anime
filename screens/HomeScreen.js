import * as React from 'react';
import { Image, Platform, StyleSheet , TouchableOpacity, View, ImageBackground, Alert, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {Input,Button,Text, Icon, Container, Item, Label, Grid, Col, Card, CardItem, Spinner,} from 'native-base';
import { Header, Left, Title, Body, Right, Content, Footer, FooterTab} from 'native-base';

export default class HomeScreen extends React.Component {
  state={
	val:"",
	search:"",
	items: [],
	text:""
  }
	componentDidMount() {
		this.refresh();
	}
	refresh = () => {	
		AsyncStorage.getItem("mylist").then(resp => {
			this.setState({items:JSON.parse(resp)})
		});
	}

  render() {

    return (
		<ScrollView>
			<FlatList
				data={this.state.items}
				renderItem={({item,index}) => 
					<AnimeBlock refresh={this.refresh} chngScreen={this.props.chngScreen} item={item} />
				}
				keyExtractor={(item) => item.name}
			/>
		</ScrollView>
    );
  }
}

class AnimeBlock extends React.Component {
	state = {
		loading:false,
	}
	getEpisodes = async (e) => {
		const animid = /var\s+id\s+=\s+(\d+);/gm;
		this.setState({loading:true})
		var rawweb = await (await fetch("https://www2.gogoanime.video/category/"+e.url)).text();
		let m,id;
	
		while ((m = animid.exec(rawweb)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === animid.lastIndex) {
				animid.lastIndex++;
			}
			id = m[1];
		}
		var rawep = await (await fetch("https://ajax.apimovie.xyz/ajax/load-list-episode?ep_start=1&ep_end=9999999&id="+id)).text()
			// this.setState({text:resp.content});
			// RegExp.
		const episreg = /<a\s+href="\s+\/(.*?)".*[\s\n]+.*?<\/span>\s+(.*)<.*/gm;
		var episodes = [];
		while ((m = episreg.exec(rawep)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === episreg.lastIndex) {
				episreg.lastIndex++;
			}
			var epdata = {url:m[1],ep:m[2]};
			episodes.push(epdata);
		}
		this.setState({loading:false})
		this.props.chngScreen(3,episodes)
		// this.setState({items:animes})
	}
	removeItem = (e) => {
		AsyncStorage.getItem("mylist").then(resp => {
			var items = JSON.parse(resp);
			items = items.filter((item)=>{
				return item.name!=e.name
			});
			AsyncStorage.setItem("mylist",JSON.stringify(items)).then(() => {
				this.setState({items:items});
				alert("Done");
			})
			this.props.refresh()
		})
	}
	render() {
		const item = this.props.item
		return(
			<Card transparent style={{paddingHorizontal:10}} >
				<ImageBackground style={{height:200,width:"100%"}} source={{uri:item.image}}>
					<Container style={{flex:1,alignContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.6)"}}>
						<CardItem header style={{backgroundColor:"#00000000"}}>
							<Text style={{fontSize:30,textAlign:"center",fontWeight:"600",letterSpacing:1.3,color:"#fff"}}>{item.name}</Text>
						</CardItem>
						<CardItem style={{backgroundColor:"#00000000"}} >
							<Button rounded onPress={() => {this.getEpisodes(item)}} style={{flex:-1,borderWidth:2,alignItems:"center",width:50,height:50,marginHorizontal:5,borderColor:"#fff"}} transparent>
								{
									this.state.loading?
										<Spinner/>:
										<Icon style={{color:"#fff"}} name="film" />
								}

							</Button>
							<Button rounded onPress={() => {this.removeItem(item)}} style={{borderWidth:2,width:50,height:50,marginHorizontal:5,borderColor:"#fff"}} transparent><Icon style={{color:"#fff"}} name="remove" /></Button>
						</CardItem>
					</Container>
				</ImageBackground>
			</Card>
		)
	}
}