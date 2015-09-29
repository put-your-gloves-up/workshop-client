/**
 * Created by jerek0 on 29/09/15.
 */
import config from "../config";
import $ from "jquery";
import io from "socket.io-client";
import * as util from "../misc/util";
    
export default class NetworkManager {
    constructor() {
        this.socket = io(config.server+':'+config.port);
        
        this.init();
    }
    
    init() {
        this.socket.on('connect', this.socketReady.bind(this));
    }

    /*******************
     *
     *	CONNECT IO
     *
     *******************/
    
    socketReady() {
        console.log('socket ready');

        // listen socket
        this.socket.on('getUserId', this.getUserId.bind(this));
        this.socket.on('getUsersList', this.getUsersList.bind(this));

        // call for userid
        this.socket.emit('getUserId');
    }

    /*******************
     *
     *	IO EVENTS
     *
     *******************/
    
    getUserId(id) {
        // user id
        this.uid = id;
        
        console.log('get user id', this.uid);

        $('#user').text(this.uid);

        // now that we got the user id, connect peer
        this.connectPeer();
    }
    
    getUsersList(users) {
        console.log('get users list', users);

        // display list
        var i = 0;
        for(i; i < users.length; i++){
            // don't display the current user (hein)
            if(users[i] != this.uid){
                $('#users').append('<li><a data-user="' + users[i] + '">Call ' + users[i] + '</a></li>');
            }
        }

        // listen for click on users list
        $('body').on('click', '#users a', this.askCall.bind(this));
    }

    /*******************
     *
     *	CONNECT PEER
     *
     *******************/
    
    connectPeer() {
        console.log('connect peer');

        // connect peer
        this.peerConn = new Peer(this.uid, {
                host: config.server, port: config.port, path: '/peer',
                config: {'iceServers': config.iceServers }
            }
        );

        // listen for peer open
        this.peerConn.on('open', this.peerReady.bind(this));

        // listen for a call
        this.peerConn.on('call', this.receiveCall.bind(this));
    }

    peerReady(peerId){

        console.log('peer ready '+peerId);

        // ok peer connection is ready - now get user list
        this.socket.emit('getUsersList');
    }

    /*******************
     *
     *	SENDING CALL
     *
     *******************/
    
    askCall(e){

        console.log('call');

        // get user to call
        this.cid = $(e.currentTarget).data('user');

        // get our video
        navigator.getUserMedia({audio: true, video: true}, this.sendCall.bind(this), util.log);
    }

    // send call
    sendCall(stream){

        console.log('really call');

        // call someone - send our audio stream
        this.peerCall = this.peerConn.call(this.cid, stream);

        // listen call for stream
        this.peerCall.on('stream', this.receiveStream.bind(this));
    }

    /*******************
     *
     *	GETTING CALL
     *
     *******************/

    receiveCall(call){
        console.log('get call');

        // call
        this.peerCall = call;

        // listen call for stream
        this.peerCall.on('stream', this.receiveStream.bind(this));

        // get our micro stream
        navigator.getUserMedia({audio: true, video: true}, this.answerCall.bind(this), util.log);
    }

    answerCall(stream){
        console.log('answer call');

        // answering to the call - sending our micro stream
        this.peerCall.answer(stream);
    }

    /*******************
     *
     *	GET STREAM
     *
     *******************/

    receiveStream(stream){

        console.log('reveive stream', stream);

        // push the stream to video
        $('video')[0].src = window.URL.createObjectURL(stream);
    }
    
}