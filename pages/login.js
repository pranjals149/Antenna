import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

function Login() {
    const signIn = () => {
        auth.signInWithPopup(provider)
            .catch(alert);
    }
    return (
        <Container>
            <Head>
                <title>Login</title>
                <link rel="icon" href="https://image.freepik.com/free-vector/flying-satellite-with-antenna-space-cartoon-icon-illustration_138676-2898.jpg" />
            </Head>

            <LoginContainer>
                <Logo src="https://image.freepik.com/free-vector/flying-satellite-with-antenna-space-cartoon-icon-illustration_138676-2898.jpg" />
                <Button variant='outlined' onClick={signIn}>Sign In with Google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
    height: 300px;
    width: 300px;
    margin-bottom: 50px;
`;
