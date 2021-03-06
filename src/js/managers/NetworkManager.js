/**
 * Created by jerek0 on 29/09/15.
 */
import config from "../config";
import $ from "jquery";
import io from "socket.io-client";
import * as util from "../misc/util";


/**
 * This instance manages all network stuff and allows to connect to
 * the socket.io server and to use webRTC between clients *
 * */
export default class NetworkManager {
    constructor() {
        this.socket = io(config.server+':'+config.port);
        
        this.init();
    }

    /**
     * Initialize our NetworkManager * 
     */
    init() {
        this.socket.on('connect', this.socketReady.bind(this));
        
        this.bindUIActions();
    }

    /**
     * NetworkManager's user interface actions manager *
     */
    bindUIActions() {
        // listen for click on users list
        $('body').on('click', '#users a', this.askCall.bind(this));
    }

    /*******************
     *
     *	CONNECT IO
     *
     *******************/

    /**
     * Called when receiving 'connect' event from socket.io server *
     */
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

    /**
     * Receiving local user ID from the server *
     * @param id
     */
    getUserId(id) {
        // user id
        this.uid = id;
        
        console.log('received user id', this.uid);

        // Inform our user
        $('#user').text(this.uid);

        // now that we got the user id, connect peer
        this.connectPeer();
    }

    /**
     * Receiving users list from the server *
     * @param users
     */
    getUsersList(users) {
        console.log('get users list', users);
        
        // Empty the view
        $('#users').empty();

        // Re-fill the view
        if(users.length > 1) {
            var i = 0;
            for (i; i < users.length; i++) {
                // don't display the current user (hein)
                if (users[i] != this.uid) {
                    $('#users').append('<li><a class="padding-std" data-user="' + users[i] + '">' + users[i] + '</a></li>');
                }
            }
        } else {
            $('#users').append('<li>Nobody\'s available</li>');
        }
    }

    /*******************
     *
     *	CONNECT PEER
     *
     *******************/

    /**
     * Connects user to the webRTC server and wait for incoming events *
     */
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

    /**
     * Peer is ready, ask for users list *
     * @param peerId
     */
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
        this.sendCall(workshop.localWebcamStream);
    }

    // send call
    sendCall(stream){

        console.log('really call');

        // call someone - send our audio stream
        this.peerCall = this.peerConn.call(this.cid, stream);

        // hide networkUI
        $('.network-ui').toggleClass('hidden',true);
        
        this.peerCall.on('stream', this.receiveStream.bind(this));
        this.socket.on('peerToPeer', this.receiveData.bind(this));
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
        
        this.cid = this.peerCall.peer;

        // listen call for stream
        this.peerCall.on('stream', this.receiveStream.bind(this));
        this.socket.on('peerToPeer', this.receiveData.bind(this));

        // hide networkUI
        $('.network-ui').toggleClass('hidden',true);

        // get our micro stream
        this.answerCall(workshop.localWebcamStream);
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
        $('#distVideo')[0].src = window.URL.createObjectURL(stream);
        setTimeout(function() { workshop.app.webcamManagers.distant.canvasManager.updateSize() }, 1000);
    }
    
    /*
     * DATA
     */
    
    receiveData(data) {
        //console.log(data);
        if(data.type && data.type == 'colorsTrack') workshop.app.webcamManagers.distant.onColorTrack(data.event);
    }
    
    sendData(data) {
        //console.log(data);
        this.socket.emit('peerToPeer', data);
    }
    
}