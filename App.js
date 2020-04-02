/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Container, Text,Header, Left, Title, Body, Right, Content, Button, Icon, Footer, FooterTab} from 'native-base';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import EpisodesScreen from './screens/EpisodesScreen';
import AnimePlayer from './screens/AnimePlayer';

/*

--------------------API------------------

ANIME SEARCH DATA
<a href=\\"(.*?)\\".*?url\(\\"(.*?)\\".*?<\\\/div>(.*?)<\\\/a>

ANIME EPISODES DATA
<a\s+href="\s+\/(.*?)".*[\s\n]+.*?<\/span>\s+(.*)<.*

IFRAME LINK
<iframe src="\/\/vidstreaming\.io\/streaming\.php\?(.*?)"

VIDEO URL
<div class="dowload"><a[\n ]* href="(.*)" download>

*/


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		isReady: false,
		screen: 1,
	};
	this.ref = React.createRef();
  }
  chngScreen = (e,data) => {
	this.sharedata= data?data:null
    this.setState({screen:e});
  }
  async componentDidMount() {
    // await Font.loadAsync({
    //   Roboto: require('native-base/Fonts/Roboto.ttf'),
    //   Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //   ...Ionicons.font,
    // });
    this.setState({ isReady: true });
  }

  render() {
    // if (!this.state.isReady) {
    //     return <AppLoading />;
    // }
	var comp = <HomeScreen chngScreen={this.chngScreen} />
	switch (this.state.screen) {
		case 1:
			comp = <HomeScreen chngScreen={this.chngScreen} />;
			break;
		case 2:
			comp = <SearchScreen chngScreen={this.chngScreen} />;
			break;
		case 3:
			comp = <EpisodesScreen chngScreen={this.chngScreen} data={this.sharedata} />;
			break; 
		case 4:
			comp = <AnimePlayer chngScreen={this.chngScreen} data={this.sharedata} />;
			break;
		default:
			break;
	}
    return (
		<Container style={{backgroundColor:"#000000"}}>
          <Header transparent androidStatusBarColor="#00000000">
            <Left>
            </Left>
            <Body>
              <Title>Anime</Title>
            </Body>
            <Right />
          </Header>
          <Content>
			  {
				  comp
			  }
          </Content>
          <Footer style={{backgroundColor:"#00000000"}}>
            <FooterTab style={{backgroundColor:"#00000000"}}>
              <Button active={this.state.screen==1} onPress={()=>{this.chngScreen(1)}} >
                <Icon name="apps" />
                <Text>My List</Text>
              </Button>
              <Button active={this.state.screen==2} onPress={()=>this.chngScreen(2)}>
                <Icon name="search" />
                <Text>Search</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
    );
  }
}