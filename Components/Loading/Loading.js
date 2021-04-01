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
                    src="https://image.freepik.com/free-vector/flying-satellite-with-antenna-space-cartoon-icon-illustration_138676-2898.jpg"
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
