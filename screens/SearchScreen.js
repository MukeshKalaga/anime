import * as React from 'react';
import { Image, Platform, StyleSheet , TouchableOpacity, View, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {Input,Button,Text, Icon, Container, Item, Label, Grid, Col, Card, CardItem,} from 'native-base';
export default class SearchScreen extends React.Component {
  state={
	val:"",
	search:"",
	items: [],
	text:""
  }
  componentDidMount() {
	  AsyncStorage.getItem("mylist").then(resp => {
		  if(resp==null||resp=="1") {
			  AsyncStorage.setItem("mylist",JSON.stringify([])).then((resp) => {
			  })
		  }
	  })
  }
  onChng = (e) => {
	this.setState({"search":e})
	this.search(e)
  }

  search = (e) => {
	fetch("http://ajax.apimovie.xyz/site/loadAjaxSearch?keyword="+e).then((resp)=> resp.json()).then(resp => {
		this.setState({text:resp.content});
		// RegExp.
		const regex = /<a href="category\/(.*?)".*?url\("(.*?)".*?<\/div>(.*?)<\/a>/gm;
		const str = resp.content;
		let m;
		var animes = [];
		while ((m = regex.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			var data = {
				name:m[3],
				url:m[1],
				image:m[2]
			}
			animes.push(data);
		}
		this.setState({items:animes})
		
		
	})
  }
  addItem = (e) => {
		AsyncStorage.getItem("mylist").then((resp) => {
			var list = JSON.parse(resp);
			var stat = false;
			list.map(val => {
				if(val.name==e.name) {
					stat = true;
				}
				return;
			})
			if(stat) {
				alert("Already in List");
			} else {				
				list.push(e);
				AsyncStorage.setItem("mylist",JSON.stringify(list)).then(() => {
					alert("Added Successfully")
				})
			}
		})
		console.log(e);
	  
  }
  render() {

    return (
		<ScrollView>
			<View style={{paddingHorizontal:10}}>
				<Item floatingLabel  style={{marginVertical:10}}>
					<Icon style={{color:"#fff"}} name="search" />
					<Label style={{color:"#fff"}}>Search</Label>
					<Input style={{color:"#fff"}} value={this.state.search} onChangeText={this.onChng} />
				</Item>
				{
					this.state.items.map((item) => 
					<Card transparent >
						<ImageBackground style={{height:200,width:"100%",borderRadius:20}} source={{uri:item.image}}>
							<Container style={{backgroundColor:"#00000055",flex:1,alignContent:"center",alignItems:"center"}}>
								<CardItem header style={{backgroundColor:"#00000000"}}>
									<Text style={{fontSize:30,textAlign:"center",fontWeight:"600",letterSpacing:1.3,color:"#fff"}}>{item.name}</Text>
								</CardItem>
								<CardItem style={{backgroundColor:"#00000000"}} >
									<Button rounded onPress={() => {this.addItem(item)}} style={{borderWidth:2,width:50,height:50,borderColor:"#fff"}} transparent><Icon style={{color:"#fff"}} name="add" /></Button>
								</CardItem>

							</Container>
						</ImageBackground>
					</Card>
					)
					
				}
			</View>
		</ScrollView>
    );
  }
}
