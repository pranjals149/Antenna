import Head from 'next/head'
import Sidebar from '../Components/Sidebar/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Antenna</title>
        <link rel="icon" href="https://image.freepik.com/free-vector/flying-satellite-with-antenna-space-cartoon-icon-illustration_138676-2898.jpg" />
      </Head>

      <Sidebar />
    </div>
  )
}
