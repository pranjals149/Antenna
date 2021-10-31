import { Circle } from 'better-react-spinkit'

function Loading() {
    return (
        <center style={{
            display: "grid",
            placeItems: "center",
            height: "100vh"
        }}>
            <div>
                <img
                    src="https://cdn.pixabay.com/photo/2016/04/25/07/15/man-1351317_960_720.png"
                    alt=""
                    height={400}
                    style={{
                        marginBottom: 10
                    }}
                />
                <Circle color='#3cbc28' size={70} />
            </div>
        </center>
    )
}

export default Loading
