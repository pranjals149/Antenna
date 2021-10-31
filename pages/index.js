import Head from 'next/head'
import Sidebar from '../Components/Sidebar/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Antenna</title>
        <link rel="icon" href="https://cdn.pixabay.com/photo/2016/04/25/07/15/man-1351317_960_720.png" />
      </Head>

      <Sidebar />
    </div>
  )
}
