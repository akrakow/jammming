import React from 'react';
import { TrackList } from './../TrackList/TrackList';

/*Import CSS styles*/
import './PlayList.css';

export class PlayList extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (<div className="Playlist">
            <input value={this.props.playListName} onChange={this.handleNameChange} />
            <TrackList tracks={this.props.playListTracks} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={true} />
            <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
        </div>)
    }
}