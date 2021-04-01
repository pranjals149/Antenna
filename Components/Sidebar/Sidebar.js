import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChatIcon from '@material-ui/icons/Chat'
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from 'email-validator'
import { auth, db } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from "../Chat/Chat";
import { useState } from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function Sidebar() {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const createChat = () => {
        const input = prompt('Enter the email id of the user to chat with');

        if (!input) return null;

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            db
                .collection('chats')
                .add({
                    users: [user.email, input],
                })
        }

        if (!EmailValidator.validate(input)) {
            alert("Not a valid email");
        }

        if (input === user.email) {
            alert("Cannot send messages to the same logged In email !!")
        }

    }

    const chatAlreadyExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            chat => chat.data().users.find(
                user => user === recipientEmail)?.length > 0
        )

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} title="Click to Sign Out" />

                <IconContainer title="Start a new chat">
                    <IconButton>
                        <ChatIcon onClick={createChat} />
                    </IconButton>

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
                        <MenuItem style={{
                            color: "gray",
                            cursor: "context-menu"
                        }}>
                            Signed in as {user.email}
                        </MenuItem>
                        <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
                    </Menu>

                </IconContainer>
            </Header>

            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search ..." />
            </Search>

            <SidebarButton onClick={createChat}>
                Start a new chat
            </SidebarButton>

            {/* Chats section */}
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}

        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`
