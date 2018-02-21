import React from 'react';
import { SearchBar } from './../SearchBar/SearchBar';
import { SearchResults } from './../SearchResults/SearchResults';
import { PlayList } from './../PlayList/PlayList';
import Spotify from './../../util/Spotify';

/*Import CSS styles*/
import './App.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: 'New Playlist',
      playListTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);

    Spotify.getAccessToken();
  }

  addTrack(track) {
    let tracks = this.state.playListTracks;
    if (tracks.indexOf(track.id) < 0) {
      tracks.push(track);
    }
    this.setState({ playListTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    let updatedPlayList = tracks.filter(function(t) {
      return t.id !== track.id;
    });
    this.setState({ playListTracks: updatedPlayList });
  }

  updatePlayListName(name) {
    this.setState({ playListName: name });
  }

  savePlayList() {
    let { playListName, playListTracks } = this.state;
    let playListURIs = [];
    playListTracks.forEach(function(element) {
      playListURIs.push(element.uri);
    });
    Spotify.savePlaylist(playListName, playListURIs);
    this.setState({
      playListName: 'New Playlist',
      playListTracks: [] 
    });
  }

  async search(term) {
    let results = await Spotify.search(term);
    this.setState({ searchResults: results });
  }

  render() {
    return (<div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults
            searchResults={this.state.searchResults}
            onAdd={this.addTrack}
            onSearch={this.search}
          />
          <PlayList
            playListName={this.state.playListName}
            onNameChange={this.updatePlayListName}
            playListTracks={this.state.playListTracks}
            onRemove={this.removeTrack}
            onSave={this.savePlayList}
          />
        </div>
      </div>
    </div>)
  }
}