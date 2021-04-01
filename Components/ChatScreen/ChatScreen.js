import { Avatar, IconButton } from "@material-ui/core"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import { auth, db } from "../../firebase"
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useCollection } from 'react-firebase-hooks/firestore'
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import Message from "../Message/Message"
import { useRef, useState } from "react"
import firebase from 'firebase'
import getRecipientEmail from "../../utils/getRecipientEmail"
import TimeAgo from 'timeago-react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Picker, emojiIndex } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css'

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        padding: "20px"
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const lightTheme = {
    background: 'white',
    text: 'black',
}

const darkTheme = {
    background: 'black',
    text: 'white',
}

function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    const [input, setInput] = useState("");
    const router = useRouter()
    const endOfMessagesRef = useRef(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const [emojiPicker, setEmojiPicker] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();

        //update the time stamp
        db
            .collection('users')
            .doc(user.uid)
            .set({
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })

        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL
            })

        setInput("");
        scrollToBottom();
    }

    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where('email', '==', getRecipientEmail(chat.users, user))
    )

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const recipientEmail = getRecipientEmail(chat.users, user);

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <p style={{
                textAlign: "center",
                marginBottom: "-10px"
            }}>You are having a conversation with: </p>
            <h2>{recipientEmail}</h2>
            {recipientSnapshot ? (
                <p style={{ textAlign: "center" }}>
                    Last Seen: {' '}
                    {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo
                            datetime={recipient?.lastSeen?.toDate()}
                        />
                    ) : "Unavailable"}
                </p>
            ) : (
                <p>Loading Last Seen</p>
            )}
        </div>
    );

    const handleTogglePicker = () => {
        setEmojiPicker(!emojiPicker)
    }

    return (
        <Container>
            {emojiPicker && (
                <Picker
                    set='apple'
                    title='Pick your emoji'
                    emoji="point_up"
                    style={{
                        position: "absolute",
                        zIndex: "100"
                    }}
                    native
                />
            )}


            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                            Last Seen: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo
                                    datetime={recipient?.lastSeen?.toDate()}
                                />
                            ) : "Unavailable"}
                        </p>
                    ) : (
                        <p>Loading Last Seen</p>
                    )}
                </HeaderInformation>

                <HeaderIcons>

                    <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleOpen}>
                            More Info
                        </MenuItem>

                        <Modal
                            open={open}
                            onClose={handleModalClose}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            {body}
                        </Modal>

                    </Menu>

                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <IconButton onClick={handleTogglePicker}>
                    <InsertEmoticonIcon />
                </IconButton>

                <Input value={input} onChange={e => setInput(e.target.value)} />

                <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>

            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
`

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    >  p {
        font-size: 14px;
        color: gray;
        margin-top: 0;
    }
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`

